
const Notes = require('../models/Notes');
const note = require('../models/Notes');
const mongoose = require('mongoose');

// get dashbord

exports.dashboard = async(req, res) =>{
  let perPage = 12;
  let page = req.query.page || 1;
   
    const locals = {
               title: "Dashboard",
               description: 'A simple Notes App made using Nodejs'
           }

           try{
             Notes.aggregate([
              {
                $sort:{
                  createdAt: -1,
                }
              },
              {$match: {user:mongoose.Types.ObjectId(req.user.id)}},
              {
                $project : {
                  title:{$projectsubstr:['$title', 0, 30]},
                  body:{$substr:['$body', 0, 100]},
                  
                }
              }
             ]) .skip(perPage * page - perPage)
             .limit(perPage)
             .exec(function(err, notes){
                Note.count().exec(function(err, count){
                  if(err) return next(err);

                  res.render('dashboard/index',{
                    userName: req.user.firstName,
                     locals,
                     notes,
                     layout: '../views/layouts/dashboard',
                     current: page,
                     pages: Math.ceil(count / perPage)
                    });

                })
            });

           } catch(error){
             console.log('Error fetching notes');
            //  res.status(500).send('Error fetching notes');
           }
        }

        // View specific note

        exports.dashboardViewNote = async(req, res) =>{
          const note = await Note.findById({_id:req.params.id})
          .where({user:req.user.id}).lean();


          if(note){
            res.render('dashboard/view-note', {
              noteID: req.params.id,
              note,
              layout: '../views/layouts/dashboard',
            });
          } else{
            res.status(404).send('Something went Wrong');
          }

        }
        exports.dashboardUpdateNote = async(req, res) =>{
          try{
            await Note.findOneandUpdate({ _id:req.params.id},
              {title: req.body.title, body: req.body.body}
            ).where({user: req.user.id});
            res.redirect('/dashboard');
          } catch(error){
            console.log('Error updating note');
            res.status(500).send('Error updating note');
          }

        }
