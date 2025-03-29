// get dashbord

exports.dashboard = async(req, res) =>{
    const locals = {
               title: "Dashboard",
               description: 'A simple Notes App made using Nodejs'
           }
        res.render('dashboard',{
             locals,
             layout: '../views/layouts/dashboard'
            });
        }