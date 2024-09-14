const Teams = require('../models/Teams');
const User = require('../models/User');
const { generateJwtToken } = require('../helpers/JwtTokenHelper');
const { hashPassword, comparePassword } = require('../helpers/HashPassword')
require('dotenv').config();

//Add Employee here
const RegisterEmployees = async( req, res ) => {
try{
    const {
        employeeName,
        employeeId,
        employeeMobileNumber,
        email,
        password,
        designation,
        leaderId,
        gstin,
        panCardNumber,
        employeeAadharNumber,
        employeePanNumber,
        employeeCurrentAddress,
        employeePermanentAddress,
        companyName,state,
        district,
        taluka,
        village,
        personalEmailId
      } = req.body;

      const existingEmployee = await Teams.findOne({
        $or: [{ employeeId }, { employeeMobileNumber }, { email}]
      });
      
    //   const existingAdmin = await User.findOne({ email });
    const existingAdmin = await User.findOne({ email });
      
      if (existingEmployee || existingAdmin) {
        // Handle the conflict case here
        return res.status(400).json({
          status: 400,
          message: "Conflict: Employee ID, Mobile Number, or Email ID already exists in the system",
        });
      }

      const hashedPassword = await hashPassword(password);
      const newEmployee = new Teams({
        employeeName,
        employeeId,
        employeeMobileNumber,
        email,
        password: hashedPassword,
        designation,
        leaderId,
        gstin,
        panCardNumber,
        employeeAadharNumber,
        employeePanNumber,
        employeeCurrentAddress,
        employeePermanentAddress,
        state,
        district,
        taluka,
        village,
        companyName,
        personalEmailId
      });
      await newEmployee.save();

      res.status(201).json({
        status: 201,
        message: 'Employee Added Successfully',
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }


};

//fetch all team member based on role
const getAllTeamMembers = async(req, res) => {
  try {
    //check leader id 
    const leaderId = req.user.id;
    
    const teamMembers  = await Teams.find({ leaderId:leaderId,isActive:true});

    if (!teamMembers) {
      return res.status(404).json({
          message: 'No team members found'
      });
  }
  //if no employee member found
  if(teamMembers.length === 0){
    return res.status(200).json({
      message:"No active Employee found ",
      teamMembers:[]
    });
  }
  res.status(200).json({
    message: 'Get All Team member successfully',
    teamMembers
});
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error'
    });
  }
}


//get employee by id
const getTeamMemberById = async(req, res) => {
  try {
    //admin dealer  retailde id
    const leaderId = req.user.id;

    const {id} = req.params;
    if(!id){
      return res.status(400).json({
        message: 'Bad Request : Team memeber Id is required'
      });
    }
    const teamMembers = await Teams.findOne({_id:id, leaderId:leaderId,isActive:true})

    if(!teamMembers){
      return res.status(404).json({
        message:'Team memebr not found'
      });
    }

    res.status(200).json({
      message: 'Get Team member  successfully',
      teamMembers
  });

    } catch (error) {
      console.error(error);
        res.status(500).json({ message: 'Server error' });
  }
}


//update employee

const updateTeamMember = async(req, res) => {
  try {
    //authenticated id
    const leaderId = req.user.id;

    const {id} = req.params;
    if(!id){
      return res.status(400).json({
      message: 'Bad Request : Team memeber Id is required'
    });
    }
    //new employee data 
    const updateData = req.body;
    if(Object.keys(updateData).length === 0){
      return res.status(400).json({
        message:'No data provided for updating',
        data:[]
      });
    }
    // find and update the data
    const updateTeamMember = await Teams.findOneAndUpdate({
      _id:id, leaderId:leaderId, isActive:true
    },
     updateData, //here data that we update
      {new:true});//return the document

      if(!updateTeamMember){
        return res.status(404).json({
          message:'Team memeber not found or not authorized to update'
        });
      }
      
      res.status(200).json({
        message: 'Team member updated successfully',
        updateTeamMember
    });

  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({
        message: 'Server error: Could not update team member'
    });
  }
}

//Toggle or deactive the team member 

const toggleTeamMemberStatus = async (req, res) => {
  try {
      const leaderId = req.user.id;  // Authenticated user's ID (leader)
      const { id } = req.params;  // Employee ID from the route parameters

      // Find the team member and toggle the isActive status
      const teamMember = await Teams.findOneAndUpdate(
          { _id: id, leaderId: leaderId, isActive: true },  );

      if (!teamMember) {
          return res.status(404).json({
              message: 'Team member not found or already inactive'
          });
      }
       // Toggle the `isActive` status
       teamMember.isActive = !teamMember.isActive;
       await teamMember.save();

       res.status(200).json({
           message: `Team member ${teamMember.isActive ? 'activated' : 'deactivated'} successfully`,
           teamMember
       });

  } catch (error) {
      console.error('Error deactivating team member:', error);
      res.status(500).json({
          message: 'Server error: Could not deactivate team member'
      });
  }
};

//delete team member

const deleteTeamMember = async (req, res) => {
  try {
      const leaderId = req.user.id;
      const { id } = req.params;

      // Find and delete the team member by their ID and leader ID
      const deletedTeamMember = await Teams.findOneAndDelete({ _id: id, leaderId: leaderId });

      if (!deletedTeamMember) {
          return res.status(404).json({
              message: 'Team member not found '
          });
      }

      res.status(200).json({
          success : true,
          message: 'Team member deleted successfully'
      });

  } catch (error) {
      console.error('Error deleting team member:', error);
      res.status(500).json({
          message: 'Server error: Could not delete team member'
      });
  }
};
module.exports = {
    RegisterEmployees,
    getAllTeamMembers,
    getTeamMemberById,
    updateTeamMember,
    toggleTeamMemberStatus,
    deleteTeamMember
}