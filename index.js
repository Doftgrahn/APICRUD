const Joi = require("@hapi/joi");
const express = require("express");
const app = express();

app.use(express.json());

const bandMembers = [
    {id: 0, name: "Simon"},
    {id: 1, name: "Mickel"},
    {id: 2, name: "Erik"},
    {id: 3, name: "Viktor"},
    {id: 4, name: "Jimmy"},
    {id: 5, name: "MrCapo"}
];

app.get("/", (req, res) => {
    res.send("Hello World");
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

const validateBand = bands => {
    const schema = {
        name: Joi.string()
            .min(3)
            .required()
    };
    return Joi.validate(bands, schema);
};

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port: ${port}`));

console.log("Peace Out!");
