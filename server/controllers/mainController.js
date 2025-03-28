// get Hompage

exports.homepage = async(req, res) =>{
    const locals = {
               title: "Notes App",
               description: 'A simple Notes App made using Nodejs'
           }
        res.render('index',{
             locals,
             layout: '../views/layouts/front-page'
            });

}
// get About
exports.about = async(req, res) =>{
    const locals = {
               title: "About- Notes App",
               description: 'A simple Notes App made using Nodejs'
           }
        res.render('about', locals);

}