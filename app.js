const express = require('express');
const router = express.Router();
const app = express();
const uuid = require('uuid');
const mongoClient = require('mongodb').MongoClient;
const axios = require('axios');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
app.use(bodyParser());

const dbName = 'pets'

//to change to a local database, use the other url
var url = 'mongodb://127.0.0.1:27017/petsandpeople';
// var url = 'mongodb://Inflight:InflightPassword1@ds061839.mlab.com:61839/petsandpeople';
//
//handles POST request for OWNER
//
app.post('/api/owners', function (req, res) {
	
	//creates the owner from the pattern
	var owner = {
		firstName: req.body.owner.firstName,
		lastName: req.body.owner.lastName,
		age: req.body.owner.age,
		petsList: []
	};
	console.log('created owner');
	//connects to the db and inserts the owner
	mongoClient.connect(url, function (err, db) {
		if (err) throw err; // here
		var dbo = db.db("petsandpeople");
		dbo.collection("owners").insertOne(owner,
			function (err, res2) {
				if (err) throw err;
				console.log("1 owner document inserted");
				debugger
				db.close();
				res.send(res2);
			});
	});
});

//
//handles POST request for PETS
//
app.post('/api/pets', function (req, res) {
	res.send(req.body);
	//creates the owner from the pattern
	var pet = {
		name: req.body.pet.name,
		type: req.body.pet.type,
		owner: req.body.pet.owner
	};
	console.log('created pet');
	//connects to the db and inserts the owner
	mongoClient.connect(url, function (err, db) {
		if (err) throw err;
		var dbo = db.db("petsandpeople");
		var query = { lastName: req.body.pet.owner };
		var pushedPet = { $push: { petsList: { name: req.body.pet.name } } };
		dbo.collection("owners").update(query, pushedPet, function (err, obj) {
			if (err) throw err;
		});
		dbo.collection("pets").insertOne(pet,
			function (err, res) {
				if (err) throw err;
				db.close;
			});
	});
});


//
//handle DELETE requests for OWNER
//
app.delete('/api/owners', function (req, res) {
	res.send(req.body._id);
	console.log(req.body);
	mongoClient.connect(url, function (err, db) {
		if (err) throw err;
		var dbo = db.db("petsandpeople");
		var queryPet = { owner: req.body.lastName };
		var query = { _id: mongo.ObjectID(req.body._id) };
		dbo.collection("pets").deleteMany(queryPet, function (err, obj) {
			if (err) throw err;
		});
		dbo.collection("owners").deleteOne(query, function (err, obj) {
			if (err) throw err; // there was an error
			db.close(); // this is not executed => db connection isn't closed
		});
	});
})

//
//handle DELETE requests for PETS
//
app.delete('/api/pets', function (req, res) {
	res.send(req.body._id);
	mongoClient.connect(url, function (err, db) {
		if (err) throw err;
		var dbo = db.db("petsandpeople");

		var petName;
		var query = { _id: mongo.ObjectID(req.body._id) };
		var pulledPet = { $pull: { petsList: { name: req.body.name } } };

		var queryOwns = { petsList: { name: req.body.name } };
		dbo.collection("owners").update(queryOwns, pulledPet, function (err, obj) {
			if (err) throw err;
		});
		dbo.collection("pets").deleteOne(query, function (err, obj) {
			if (err) throw err;
			db.close();
		});

	});
})


//
//handles the GET request for OWNER
//
app.get('/api/owners', (req, res) => {
	mongoClient.connect(url, function (err, db) {
		if (err) throw err;
		var dbo = db.db("petsandpeople");
		dbo.collection("owners").find({}).toArray(function (err, result) {
			if (err) throw err;
			res.json(result);
			db.close();
		});
	});
});
//
//handles the GET request for PET
//
app.get('/api/pets', (req, res) => {
	mongoClient.connect(url, function (err, db) {
		if (err) throw err;
		var dbo = db.db("petsandpeople");
		dbo.collection("pets").find({}).toArray(function (err, result) {
			if (err) throw err;
			res.json(result);
			db.close();
		});
	});
});

module.exports = app;
