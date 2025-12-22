const { Project } = require('../models');

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // SECURITY: Get tenantId from the TOKEN, not the request body
    const { tenantId, userId } = req.user; 

    const result = await Project.create(null, {
      tenantId,
      name,
      description,
      createdBy: userId
    });

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const { tenantId } = req.user; // SECURITY: Enforce isolation
    const result = await Project.findAllByTenant(tenantId);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
