const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { Tenant, User } = require('../models');

exports.registerTenant = async (req, res) => {
  const { tenantName, subdomain, adminEmail, adminPassword, adminFullName } = req.body;
  
  // Connect to pool for transaction
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');

    // 1. Create Tenant
    const tenantRes = await Tenant.create(client, { 
      name: tenantName, 
      subdomain, 
      status: 'active',
      subscriptionPlan: 'free'
    });
    const newTenant = tenantRes.rows[0];

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // 3. Create Admin User linked to Tenant
    const userRes = await User.create(client, {
      tenantId: newTenant.id,
      email: adminEmail,
      passwordHash: hashedPassword,
      fullName: adminFullName,
      role: 'tenant_admin'
    });
    const newUser = userRes.rows[0];

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Tenant registered successfully',
      data: { tenant: newTenant, admin: newUser }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    client.release();
  }
};

exports.login = async (req, res) => {
  const { email, password, subdomain } = req.body;

  try {
    let user;
    
    // A. Super Admin Logic
    if (email === 'superadmin@system.com') { 
       const result = await User.findSuperAdmin(email);
       user = result.rows[0];
    } else {
       // B. Regular Tenant Login
       if (!subdomain) return res.status(400).json({ message: 'Subdomain required' });
       
       const tenantRes = await Tenant.findBySubdomain(subdomain);
       if (tenantRes.rows.length === 0) return res.status(404).json({ message: 'Tenant not found' });
       
       const userRes = await User.findByEmailAndTenant(email, tenantRes.rows[0].id);
       user = userRes.rows[0];
    }

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const validPass = await bcrypt.compare(password, user.password_hash);
    if (!validPass) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.id, role: user.role, tenantId: user.tenant_id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenant_id
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};