const admin = require('../models/admin')
const user = require('../models/user')
const bcrypt = require('bcrypt');

module.exports = {
    adminLoginDatas: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const adminLogin = await admin.findOne({ adminEmail: data.email });
                if (adminLogin) {
                    const match = await bcrypt.compare(data.password, adminLogin.adminPassword);
                    if (match) {
                        resolve({status: true, adminLogin});
                    } else {
                        resolve({status: false, message:"Passwords do not match"});
                    }
                } else {
                   resolve({status: false, message: 'Invalid Email'})
                }
            } catch (error) { 
                reject(error.message);
            }
        });
    },

    getUsers: (itemsPerPage, currentPage) => {
        return new Promise(async(resolve,reject) => {
            try {
                const skip = (currentPage - 1) * itemsPerPage;
                const totalUsers = await user.countDocuments();
                const Users = await user.find().skip(skip).limit(itemsPerPage);
                const totalPages = Math.ceil(totalUsers / itemsPerPage);
                resolve({currentPage: currentPage, Users: Users, totalPages: totalPages})
              } catch (error) {
                res.status(500).send('An error occurred');
              }
        })
    },

    blockuser: (userId) => {
        return new Promise(async(resolve, reject) =>{
            try{
                const users = await user.findByIdAndUpdate({_id: userId},{isBlocked: true})
                const button = 'green';
                resolve({status: true, message: 'User blocked successfully', users: users, button: button  })
            }
            catch (error) {
                reject(error);
            }
        })
    },

    unBlockuser: (userId) => {
        return new Promise(async(resolve, reject) =>{
            try{
                const users = await user.findByIdAndUpdate({_id: userId},{isBlocked: false})
                const button = 'red';
                resolve({status: true, message: 'User Unblocked successfully', users: users, button: button })
            }
            catch (error) {
                reject(error);
            }
        })
    }
};

   
