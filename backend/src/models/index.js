const db = require('../config/db');

const Tenant = {
  create: async (client, { name, subdomain, status, subscriptionPlan }) => {
    const query = `INSERT INTO tenants (name, subdomain, status, subscription_plan) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [name, subdomain, status, subscriptionPlan || 'free'];
    return (client || db).query(query, values);
  },
  findBySubdomain: async (subdomain) => {
    return db.query('SELECT * FROM tenants WHERE subdomain = $1', [subdomain]);
  }
};

const User = {
  create: async (client, { tenantId, email, passwordHash, fullName, role }) => {
    const query = `INSERT INTO users (tenant_id, email, password_hash, full_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, full_name, role, tenant_id`;
    const values = [tenantId, email, passwordHash, fullName, role];
    return (client || db).query(query, values);
  },
  findByEmailAndTenant: async (email, tenantId) => {
    return db.query('SELECT * FROM users WHERE email = $1 AND tenant_id = $2', [email, tenantId]);
  },
  findSuperAdmin: async (email) => {
    return db.query('SELECT * FROM users WHERE email = $1 AND tenant_id IS NULL', [email]);
  }
};

const Project = {
  create: async (client, { tenantId, name, description, createdBy }) => {
    // FORCE tenant_id to ensure isolation
    const query = `
      INSERT INTO projects (tenant_id, name, description, created_by, status) 
      VALUES ($1, $2, $3, $4, 'active') 
      RETURNING *`;
    return (client || db).query(query, [tenantId, name, description, createdBy]);
  },
  findAllByTenant: async (tenantId) => {
    // ALWAYS filter by tenant_id
    return db.query('SELECT * FROM projects WHERE tenant_id = $1 ORDER BY created_at DESC', [tenantId]);
  }
};

module.exports = { Tenant, User, Project };
