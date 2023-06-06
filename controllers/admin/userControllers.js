const {getUsers, blockuser, unBlockuser} = require("../../helpers/adminHelpers");

module.exports = {
    userManagement : (req,res) => {
        const itemsPerPage = 8;
        const currentPage = parseInt(req.query.page) || 1;
        getUsers(itemsPerPage, currentPage).then(response => {
            // res.render('admin/userManagement',{users, admin:true})
            res.render('admin/userManagement',{currentPage: response.currentPage, users: response.Users, totalPages: response.totalPages})
        })
    },
    blockUser: (req,res) => { 
        blockuser(req.params.id).then(response => {
            if(response.status){
                res.json({ user: response.users, message: 'User blocked successfully' });
            }
            else{
                res.status(500).json({ error: 'An error occurred while blocking the user' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'An error occurred while blocking the user' });
          });
    },

    unBlockUser: (req,res) => {
        unBlockuser(req.params.id).then(response => {
            if(response.status){
                res.json({ user: response.users, message: 'User unblocked successfully' });
            }
            else{
                res.status(500).json({ error: 'An error occurred while unblocking the user' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'An error occurred while unblocking the user' });
          });
    },
   
    editUser: (req, res) => {

    }
}