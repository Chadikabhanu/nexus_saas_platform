const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Get Token from Header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1]; // Remove "Bearer " prefix

  try {
    // 2. Verify Token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'super_secret_key_change_this_for_production'
    );
    
    // 3. Attach to Request
    req.user = decoded; 
    // Now req.user.tenantId is available in all controllers!
    
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
