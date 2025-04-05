const mongoose = require('mongoose');
const Note = require('../models/Notes');

// GET Dashboard
exports.dashboard = async (req, res) => {
  const perPage = 12;
  const page = parseInt(req.query.page) || 1;

  const locals = {
    title: "Dashboard",
    description: "A simple Notes App made using Nodejs"
  };

  try {
    const notes = await Note.aggregate([
      { $sort: { updatedAt: -1 } },
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $project: {
          title: { $substrCP: ["$title", 0, 30] },
          body: { $substrCP: ["$body", 0, 100] },
          updatedAt: 1
        }
      }
    ])
      .skip(perPage * (page - 1))
      .limit(perPage);

    const count = await Note.countDocuments({ user: req.user.id });

    res.render("dashboard/index", {
      userName: req.user.firstName,
      locals,
      notes,
      layout: "../views/layouts/dashboard",
      current: page,
      pages: Math.ceil(count / perPage)
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).send("Error loading dashboard");
  }
};

// View specific note
exports.dashboardViewNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id }).lean();

    if (note) {
      res.render('dashboard/view-notes', {
        noteID: req.params.id,
        note,
        layout: '../views/layouts/dashboard',
      });
    } else {
      res.status(404).send('Note not found');
    }
  } catch (error) {
    console.error("View Note error:", error);
    res.status(500).send("Error loading note");
  }
};

// Update note
exports.dashboardUpdateNote = async (req, res) => {
  try {
    await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        title: req.body.title,
        body: req.body.body,
        updatedAt: Date.now()
      }
    );
    res.redirect('/dashboard');
  } catch (error) {
    console.error("Update Note error:", error);
    res.status(500).send('Error updating note');
  }
};

// Delete note
exports.dashboardDeleteNote = async (req, res) => {
  try {
    await Note.deleteOne({ _id: req.params.id, user: req.user.id });
    res.redirect('/dashboard');
  } catch (error) {
    console.error("Delete Note error:", error);
    res.status(500).send('Error deleting note');
  }
};

// Add note form
exports.dashboardAddNote = async (req, res) => {
  res.render('dashboard/add', {
    layout: '../views/layouts/dashboard',
  });
};

// Add note submission
exports.dashboardAddNoteSubmit = async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Note.create(req.body);
    res.redirect('/dashboard');
  } catch (error) {
    console.error("Add Note error:", error);
    res.status(500).send('Error adding note');
  }
};

// Get Search Page
exports.dashboardSearch = async (req, res) => {
  try {
    res.render('dashboard/search', {
      searchResults: '',
      layout: '../views/layouts/dashboard',
    });
  } catch (error) {
    console.error("Search page error:", error);
    res.status(500).send('Error loading search page');
  }
};

// Handle Search
exports.dashboardSearchSubmit = async (req, res) => {
  try {
    const searchTerm = req.body.searchTerm;
    const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const searchResults = await Note.find({
      user: req.user.id,
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChars, 'i') } },
        { body: { $regex: new RegExp(searchNoSpecialChars, 'i') } }
      ]
    }).lean();

    res.render('dashboard/search', {
      searchResults,
      layout: '../views/layouts/dashboard'
    });
  } catch (error) {
    console.error("Search submit error:", error);
    res.status(500).send('Error searching notes');
  }
};
