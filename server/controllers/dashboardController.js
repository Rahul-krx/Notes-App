
const Notes = require('../models/Notes');
const note = require('../models/Notes');
const mongoose = require('mongoose');

// get dashbord

exports.dashboard = async(req, res) =>{
   
    const locals = {
               title: "Dashboard",
               description: 'A simple Notes App made using Nodejs'
           }

           try{
        const notes = await Note.find({});
        // console.log(notes);


           } catch(error){
             console.log('Error fetching notes');
             res.status(500).send('Error fetching notes');
 

           }


        res.render('dashboard/index',{
            userName: req.user.firstName,
             locals,
             notes,
             layout: '../views/layouts/dashboard'
            });
        }
