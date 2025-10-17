import db from '../config/db.js';

const createTeamMember = async (req, res) => {
  try {
    const { name, designation, facebook, twitter, instagram } = req.body;
    const image = req.file;

    if (!name || !designation) {
      return res.status(400).json({ message: 'Name and designation are required' });
    }

    // Check if we already have 4 team members
    const [existingMembers] = await db.execute('SELECT COUNT(*) as count FROM team_members');
    if (existingMembers[0].count >= 4) {
      return res.status(400).json({ message: 'Maximum 4 team members allowed' });
    }

    let imageData = null;
    if (image) {
      imageData = image.buffer;
    }

    const [result] = await db.execute(
      'INSERT INTO team_members (name, designation, image, facebook, twitter, instagram) VALUES (?, ?, ?, ?, ?, ?)',
      [name, designation, imageData, facebook || null, twitter || null, instagram || null]
    );

    res.status(201).json({
      message: 'Team member added successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('createTeamMember error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// const getAllTeamMembers = async (req, res) => {
//   try {
//     const [rows] = await db.execute('SELECT * FROM team_members ORDER BY id ASC');
    
//     // Convert image buffer to base64 for frontend
//     const teamMembers = rows.map(member => ({
//       ...member,
//       image: member.image ? `data:image/jpeg;base64,${member.image.toString('base64')}` : null
//     }));

//     res.json({ data: teamMembers });
//   } catch (error) {
//     console.error('getAllTeamMembers error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// teamcontroller.js
const getAllTeamMembers = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM team_members ORDER BY id ASC');
    
    const teamMembers = rows.map(member => ({
      ...member,
      image: member.image
        ? `data:image/jpeg;base64,${member.image.toString('base64')}`
        : null,
    }));

    res.json({
      success: true,
      data: teamMembers,
    });
  } catch (error) {
    console.error('getAllTeamMembers error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


const getTeamMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM team_members WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    const member = rows[0];
    member.image = member.image ? `data:image/jpeg;base64,${member.image.toString('base64')}` : null;

    res.json({ data: member });
  } catch (error) {
    console.error('getTeamMemberById error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, facebook, twitter, instagram } = req.body;
    const image = req.file;

    if (!name || !designation) {
      return res.status(400).json({ message: 'Name and designation are required' });
    }

    // Check if team member exists
    const [existing] = await db.execute('SELECT * FROM team_members WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    let imageData = existing[0].image; // Keep existing image if no new image
    if (image) {
      imageData = image.buffer;
    }

    await db.execute(
      'UPDATE team_members SET name = ?, designation = ?, image = ?, facebook = ?, twitter = ?, instagram = ? WHERE id = ?',
      [name, designation, imageData, facebook || null, twitter || null, instagram || null, id]
    );

    res.json({ message: 'Team member updated successfully' });
  } catch (error) {
    console.error('updateTeamMember error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if team member exists
    const [existing] = await db.execute('SELECT * FROM team_members WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    await db.execute('DELETE FROM team_members WHERE id = ?', [id]);

    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('deleteTeamMember error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember
};
