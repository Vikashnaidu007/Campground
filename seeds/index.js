const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/air-bnb');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedImage= async(query)=>{
    const accessKey= 'gMdGmiuP0I-9rybBIlXgy1L8ijNOU7wluUl_KFzuQVQ'; //campground
    //const accesskey= 'O1cdV8iicPpjjSQxYO4LTuES7TkD3DPpiIKzyDapv-A'; //picquest
    const response= await  fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}`);
    const data= await response.json();
    return data.results[0].urls.small;
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 20; i++) {
        const random100 = Math.floor(Math.random() * 100);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random100].city}, ${cities[random100].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: await seedImage(`${sample(descriptors)} ${sample(places)}`),
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})