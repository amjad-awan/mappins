const express=require("express")
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const cors=require("cors")
const app=express()
dotenv.config()
const pinRout=require("./routes/pins")
const userRout=require("./routes/users");
app.use(express.json())
app.use(cors())

// mongoose.connect("mongodb+srv://amjadmalikf53:<password>@cluster0.glc9bvs.mongodb.net/mappin",{useNewUrlParser: true }, function (err) { 
// 	if (err) throw err; console.log('Successfully connected')})


	const connectionString = 'mongodb+srv://amjadmalikf53:<password>@cluster0.glc9bvs.mongodb.net/mappin';


	mongoose.set('strictQuery', false);
	const connectDB = async () => {
	  try {
		const conn = await mongoose.connect(connectionString);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	  } catch (error) {
		console.log(error);
		process.exit(1);
	  }
	}

	app.use("/api/users/register",userRout)
	app.use("/api/users",userRout)
	app.use("/api/pins",pinRout)


//Connect to the database before listening
connectDB().then(() => {
	app.listen(8080,()=>{
		console.log("Back end server is running at 8080")
	
	})
})

