/*--
Dependencies
--*/
const Joi = require("@hapi/joi");
const express = require("express");
const app = express();

/*--
Data
--*/

const bandMembers = require("./data");

app.use(express.json());

/*--
All app.get is showing stuff
--*/

app.get("/", (req, res) => {
    res.send("Whats up?!");
});

app.get("/api", (req, res) => {
    res.send("Getting Closer!");
});

app.get("/api/band/", (req, res) => {
    res.send(bandMembers);
});

app.get("/api/band/:id", (req, res) => {
    const bandStuff = bandMembers.find(
        data => data.id === parseInt(req.params.id)
    );
    if (!bandStuff)
        return res.status(404).send("Band member with given ID was not found");

    res.send(bandStuff);
});

/*--
Post Stuff!
--*/

app.post("/api/band/", (request, response) => {
    const {error} = validateBand(request.body);
    if (error) return response.status(400).send(error.details[0].message);

    const band = {
        id: bandMembers.length + 1,
        name: request.body.name
    };
    bandMembers.push(band);
    response.send(band);
});

/*--
Update Object
--*/

app.put("/api/band/:id", (request, response) => {
    const bandStuff = bandMembers.find(
        data => data.id === parseInt(request.params.id)
    );
    if (!bandStuff)
        return response
            .status(404)
            .send("The Bandmember with the given id cannot be found");

    const {error} = validateBand(request.body);

    if (error) {
        response.status(400).send(error.details[0].message);
        return;
    }

    bandStuff.name = request.body.name;
    response.send(bandStuff);
});

/*--
Delete Stuff!
--*/

app.delete("/api/band/:id", (request, response) => {
    const bandStuff = bandMembers.find(
        data => data.id === parseInt(request.params.id)
    );
    if (!bandStuff)
        return response
            .status(404)
            .send("The Bandmember with the given ID cannot be found");

    const index = bandMembers.indexOf(bandStuff);
    bandMembers.splice(index, 1);
    response.send(bandStuff);
});

/*--
Function for validation
--*/

const validateBand = bands => {
    const schema = {
        name: Joi.string()
            .min(3)
            .required()
    };
    return Joi.validate(bands, schema);
};

/*--
Ports and Listen
--*/

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port: ${port}`));

console.log("Peace Out!");
