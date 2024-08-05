const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
require("dotenv").config();
//signup
exports.signUp = async (req, res) => {
  try {
    //data fetch from req body
    console.log(req.body);
    const {
      firstname,
      lastname,
      email,
      password,
      phonenumber,
    } = req.body;

    //validate karlo

    if (
      !firstname ||
      !lastname ||
      !email ||
      !password 
    ) {
      return res.status(403).json({
        success: false,
        message: "all fields are required",
      });
    }

    //check user already exist or not

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    console.log("everything is fine");
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //entry create in db

    const userData = await User.create({
        firstName: firstname,
        lastName: lastname,
        email: email,
        password: hashedPassword,
        contact:phonenumber
    });

    const data = {
      firstname : userData.firstName,
      lastname: userData.lastName,
      email: userData.email,
      password: userData.password,
      phonenumber: userData.contact
    }

    console.log("user data" ,data);
    //return response
    return res.status(200).json({
      success: true,
      message: "user is registered Successfully",
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: console.log("Error while registering user: ", error.message),
    });
  }
};

exports.login = async (req, res) => {
  try {
    //fetch email and password
    const { email, password } = req.body;

    //validation data

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill the details carefully",
      });
    }
    //user check does exist or not

    const user = await User.findOne({ email }).populate("favoriteQuote");

    if (!user) {
      return res.status(401).json({
        success: true,
        message: "user does not exist Please registered first",
      });
    }

    //generate jwt token and match password
    console.log("user", user);
    console.log("password is this: ", password);
    console.log("hashed password is this: ", user.password);

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      user.token = token;
      user.password = undefined;

      //create cookie

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password Please fill correct password",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: console.log("Error while login", error),
    });
  }
};

exports.createPost = async(req , res) => {

  try {
              //fetch user data from req body 
        const data  = req.body

        console.log('data is:' , data);

         let email = data.email
         let title = data.data.title
         let clicked = data.data.isOpen


        //validate post data 

        if(!email || !title || !clicked) {
          return res.status(400).json({
            success: false,
            message: "Please provide all data"
          })
        }
        //find user 
        const user = await User.findOne({email})

        //check for user 
        if(!user){
          return res.status(400).json({
            success: false,
            message: "User does not exist"
          })
        }

          //create post 
        let postData = await Post.create({
            quoteTitle : title,
            clicked : clicked
        })

        const userId  = user.id

        let updatedPost = user.favoriteQuote
        updatedPost = [...updatedPost , postData]

       console.log("updated Post", updatedPost);

        //update user 
        const updatedUser = await User.findByIdAndUpdate( userId , {
          favoriteQuote : updatedPost
        } , {new : true})

      console.log("user " , updatedUser);
        //return response
       
        return res.status(200).json({
          success : true,
          message : "Post created successfully",
        })


        
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success : false,
      message : `error while creating post :  ${error}`,
    })
  }



}


exports.updatePost = async(req , res) => {

  try {
              //fetch user data from req body 
        const data  = req.body
        console.log('data in update post:' , data);

        const id  = data._id
        
        //find quote 

        let quoteData = await Post.findById({_id : id})

        //validate 
        if(!quoteData) {
          return res.status(400).json({
            success : true,
            message : "Please provide correct id",
          })
        }

        //update post 

        quoteData.clicked = !quoteData.clicked

        await quoteData.save()

        //return res

        return res.status(200).json({
          success : true,
          message : "Post updated successfully",
        })

  } catch (error) {
    
    console.log(error);
    return res.status(500).json({
      success : false,
      message : `error while updating post :  ${error}`,
    })
  }
}

exports.getAllQuotes = async(req , res) => {

  try {

    console.log("all quote data" , req.body)
    //find data     
    const {email} = req.body
   
    //validate 
    if (!email ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all data"
      })
    }

  //find user 
  const user = await User.findOne({email}).populate("favoriteQuote")


  //validate user
  if(!user) {
    return res.status(400).json({
      success: false,
      message: "User does not exist"
    })
  }
  //return response
  res.status(200).json({
    success : true,
    data : user.favoriteQuote,
    message : "quotes get successfully"
  })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success : false,
      message : "error while getting all quotes"
    })
  }

}


exports.clearAllQuotes = async(req , res) => {

  try {
    //get data 
  const {email} = req.body

  //validate 

  if(!email) {
    return res.status(400).json({
      success: false,
      message: "Please provide all data"
    })
  }

  //get user 

  let user = await User.findOne({email})

  if(!user) {
    return res.status(400).json({
      success: false,
      message: "user does not exist"
    })
  }

  //update user
  user.favoriteQuote = []
  await user.save()

  //retunr response
  return res.status(200).json({
    success: true,
    message: "all quotes deleted"
  })

  } catch (error) {
    return res.status(500).json({
      success: true,
      message: `error while deleting post ${error}`
    })
  }


}



exports.getAllUsers = async (req, res) => {
  try {
    //find all the users 
    const users = await User.find({},
      {
      firstName: true,
      lastName: true,
      email:true,
      favoriteQuote : true
    });

    if (!users) {
      return res.status(401).json({
        success: false,
        message:"users not found please register first"
      })
    }

    console.log("users" , users)

    return res.status(200).json({
      success: true,
      message:"users get successfully",
      data: users
      
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message:"error occured while fetching all users details"
    })
  }
}