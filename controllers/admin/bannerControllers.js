
const {
  addbanner,
  getBanner,
  editbanner,
  updatebanner,
  deletebanner
} = require("../../helpers/bannerHelpers");

module.exports = {
  addBanner: (req, res) => {
    res.render("admin/addBanner");
  },

  addBannerData: (req, res) => {
    addbanner(req.body, req.files).then((response) => {
      res.redirect("/admin/listBanners");
    });
  },

  listBanner: (req, res) => {
    const itemsPerPage = 9;
    const currentPage = parseInt(req.query.page) || 1;
    getBanner(itemsPerPage, currentPage).then((response) => {
      res.render('admin/bannerLists',{currentPage: response.currentPage, getbanner: response.banners, totalPages: response.totalPages})
    });
  },

  editBanner: (req, res) => {
    editbanner(req.params.id).then((response) => {
      if (response.status) {
        if (response.editBanner.Status) {
          
          const isActive = "enable";
          const editBanner = response.editBanner;
          res.render("admin/editBanner", {editBanner: editBanner,isActive: isActive,
          });
        } else {
        
          const isActive = "disable";
          const editBanner = response.editBanner;
          res.render("admin/editBanner", {editBanner: editBanner, isActive: isActive,
          });
        }
      } else {
        res.render("/listBanners", { message: response.message });
      }
    });
  },

  updateBanner: (req, res) => {
    updatebanner(req.params.id, req.body, req.files).then((response) => {
        if(response.status){
            // req.flash('success', 'Banner updated successfully.');
            res.redirect('/admin/listBanners')
        } else{
            // req.flash('error', 'Banner not available.');
            res.redirect('/admin/listBanners')
        }
    });
  },

  deleteBanner: (req, res) => {
    deletebanner(req.params.id).then(response => {
      if(response.status){
        const message = response.message;
        res.json({status: response.status, message: message, updatedBanner: response.updatedBanner});
      } else{
        const message = response.message;
        res.json({status: response.status, message: message});
      }
    })
  }
};
