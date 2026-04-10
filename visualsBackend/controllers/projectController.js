import Project from '../models/projectModel.js';
import Client from '../models/clientModel.js';

// Get all projects for authenticated client
export const getClientProjects = async (req, res) => {
  try {
    const clientId = req.userId;
    console.log('📍 Fetching projects for clientId:', clientId);
    
    const projects = await Project.find({ clientId }).sort({ createdAt: -1 });
    console.log('✅ Found projects:', projects.length);
    console.log('📊 Projects data:', projects);
    
    // Enrich with client email
    const client = await Client.findOne({ firebaseUID: clientId });
    console.log('🔍 Client lookup result for', clientId, ':', client);
    console.log('📧 Client email:', client?.email);
    
    const enrichedProjects = projects.map(project => {
      const projectObj = project.toObject ? project.toObject() : project;
      if (!projectObj.clientEmail && client) {
        projectObj.clientEmail = client.email;
        console.log('✅ Added email to project:', project._id, 'Email:', client.email);
      } else {
        console.log('⚠️  Project already has email or client not found:', project._id, 'Email:', projectObj.clientEmail);
      }
      return projectObj;
    });
    
    console.log('📤 Returning enriched projects:', enrichedProjects);
    res.json(enrichedProjects);
  } catch (error) {
    console.error('❌ Error fetching client projects:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get single project by ID (for clients - with authorization check)
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Verify client owns this project
    if (project.clientId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Enrich with client email
    console.log('🔎 Looking up client for project:', id, 'clientId:', project.clientId);
    const client = await Client.findOne({ firebaseUID: project.clientId });
    console.log('👤 Client found:', client);
    console.log('📧 Client email:', client?.email);
    
    const projectObj = project.toObject ? project.toObject() : project;
    if (!projectObj.clientEmail && client) {
      projectObj.clientEmail = client.email;
      console.log('✅ Added email to project response:', client.email);
    }

    res.json(projectObj);
  } catch (error) {
    console.error('❌ Error in getProjectById:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get single project by ID for admin (no authorization check)
export const getProjectByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Enrich with client email
    console.log('🔎 [ADMIN] Looking up client for project:', id, 'clientId:', project.clientId);
    const client = await Client.findOne({ firebaseUID: project.clientId });
    console.log('👤 [ADMIN] Client found:', client);
    console.log('📧 [ADMIN] Client email:', client?.email);
    
    const projectObj = project.toObject ? project.toObject() : project;
    if (!projectObj.clientEmail && client) {
      projectObj.clientEmail = client.email;
      console.log('✅ [ADMIN] Added email to project response:', client.email);
    }

    res.json(projectObj);
  } catch (error) {
    console.error('❌ [ADMIN] Error in getProjectByIdAdmin:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get single reel details
export const getReelDetail = async (req, res) => {
  try {
    const { projectId, reelNumber } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Verify client owns this project
    if (project.clientId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const reel = project.reels.find((r) => r.reelNumber === parseInt(reelNumber));
    if (!reel) {
      return res.status(404).json({ message: 'Reel not found' });
    }

    res.json({ project, reel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Create project
export const createProject = async (req, res) => {
  try {
    let { clientId, clientEmail, clientName, projectName, projectType, packageType, deadline, totalReels, totalAmount, paidAmount, remainingAmount, deliveryTime, notes } = req.body;

    console.log('📝 [CREATE PROJECT] Request received with totalReels:', totalReels, 'Type:', typeof totalReels);

    // If clientEmail provided instead of clientId, look up the client
    if (!clientId && clientEmail) {
      const client = await Client.findOne({ email: clientEmail.toLowerCase().trim() });
      
      if (!client) {
        return res.status(404).json({
          success: false,
          message: `Client with email "${clientEmail}" not found. They must sign up first.`,
        });
      }
      
      clientId = client.firebaseUID;
      if (!clientName) clientName = client.name;
    }

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: 'Client ID or email required',
      });
    }

    // Fetch client email if not provided
    if (!clientEmail) {
      const client = await Client.findOne({ firebaseUID: clientId });
      if (client) {
        clientEmail = client.email;
      }
    }

    const totalReelsNum = Number(totalReels);
    console.log('🔢 [CREATE PROJECT] Converted totalReels to number:', totalReelsNum);

    const reels = Array.from({ length: totalReelsNum }, (_, i) => ({
      reelNumber: i + 1,
      status: 'Not Started',
      note: '',
      link: null,
      name: '',
    }));

    console.log('🎬 [CREATE PROJECT] Generated reels array length:', reels.length);
    console.log('📊 [CREATE PROJECT] Reel numbers (first 5 and last 5):', reels.slice(0, 5).map(r => r.reelNumber), '...', reels.slice(-5).map(r => r.reelNumber));

    const project = new Project({
      clientId,
      clientName: clientName || 'Unknown Client',
      clientEmail: clientEmail || '',
      projectName,
      projectType,
      packageType,
      deadline,
      totalReels: totalReelsNum,
      totalAmount,
      paidAmount,
      remainingAmount,
      deliveryTime,
      notes,
      reels,
    });

    await project.save();
    console.log('✅ [CREATE PROJECT] Project saved. Reels in DB:', project.reels.length, 'totalReels field:', project.totalReels);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    console.error('❌ [CREATE PROJECT] Error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Admin: Update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📍 updateProject called:', { id });
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
    
    const project = await Project.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!project) {
      console.log('❌ Project not found:', id);
      return res.status(404).json({ message: 'Project not found' });
    }

    console.log('✅ Project updated successfully:', { 
      projectId: project._id,
      totalReels: project.totalReels,
      reelsCount: project.reels?.length,
      reelNumbers: project.reels?.map(r => r.reelNumber)
    });
    
    res.json(project);
  } catch (error) {
    console.error('❌ Error updating project:', error.message);
    console.error('Full error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Admin: Delete project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update reel status
export const updateReelStatus = async (req, res) => {
  try {
    const { projectId, reelNumber } = req.params;
    const { status, note, link, name } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const reel = project.reels.find((r) => r.reelNumber === parseInt(reelNumber));
    if (!reel) {
      return res.status(404).json({ message: 'Reel not found' });
    }

    if (status) reel.status = status;
    if (note !== undefined) reel.note = note;
    if (link !== undefined) reel.link = link;
    if (name !== undefined) reel.name = name;
    reel.updatedAt = Date.now();

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    console.log('📦 Total projects found:', projects.length);
    
    // Enrich with client emails
    const enrichedProjects = await Promise.all(
      projects.map(async (project) => {
        const projectObj = project.toObject ? project.toObject() : project;
        console.log('🔍 Processing project:', project._id, 'clientId:', project.clientId);
        
        if (!projectObj.clientEmail) {
          const client = await Client.findOne({ firebaseUID: project.clientId });
          console.log('👤 Client lookup for', project.clientId, ':', client?.email || 'NOT FOUND');
          
          if (client) {
            projectObj.clientEmail = client.email;
            console.log('✅ Set email:', client.email);
          } else {
            console.log('⚠️  No client found for clientId:', project.clientId);
          }
        } else {
          console.log('✓ Project already has email:', projectObj.clientEmail);
        }
        return projectObj;
      })
    );
    
    console.log('📤 Returning enriched projects');
    res.json(enrichedProjects);
  } catch (error) {
    console.error('❌ Error in getAllProjects:', error);
    res.status(500).json({ message: error.message });
  }
};
