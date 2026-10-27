require('dotenv/config');

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { hash, compare } = require('bcryptjs');
const { verify } = require('jsonwebtoken');
const {fakeDB}=require('./fakeDB.js')
const {isAuth}=require('./isAuth.js');
const { 
    createAccessToken, 
    createRefreshToken,
    sendAccessToken,
    sendRefreshToken
    } =require('./token.js');
const server = express();

// ---------- Middleware ----------
server.use(cookieParser());
server.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// ---------- Routes ----------
server.post('/register', async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
}
    try{
        const existingUser = fakeDB.find(user => user.email === email);
        if (existingUser) throw new Error("User Already Exists");
        //if not user, hash the password        
        const hashedPassword = await hash(password, 10);
        //insert the user in the database
        fakeDB.push({ id: fakeDB.length, email, password: hashedPassword });
        console.log('FakeDB', fakeDB);
        return res.status(201).json({ message: 'User Created'});
        console.log('FakeDB', fakeDB);
  }  catch (err) {
  console.error(err);
  return res.status(400).json({ error: err.message });
}
});
// login
server.post('/login', async (req, res) => {
  const { email, password } = req.body || {};        // ← the guard from before
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  try {
    const user = fakeDB.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: 'User does not exist' });

    const valid = await compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Password is not correct' });

    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);
    user.refreshToken = refreshToken;

    sendRefreshToken(res, refreshToken);
    return sendAccessToken(res, accessToken, user.email);   // ← clean signature
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});
//logout
server.post('./logout', (_req,res)=>{
    res.clearCookie("refreshToken", {path: '/refresh_token'});
    return res.send({
        message:'Logged out',
    })
});

server.post('/protected', async(req, res)=>{

  try{
    const userId=isAuth(req);
    if (userId !==null) 
      res.send({
        data:'This is project data.',
      });

    }
  catch(err){
    res.send({
      error: `${err.message}`,
    })

  }
});

//5 get a new acces token with a refresh token
server.post('/refresh_token', (req, res)=>{
  const token=req.cookies.refreshToken;
  if (!token) return res.send({accessToken : ''});
  //verify the token
  let payload=null;
  try{
    payload= verify(token.process.env.REFRESH_TOKEN_SECRET);
  }catch (err){
    return res. send({accessToken:' '});
  }
  //token is valid check id user is exist
  const user=fakeDB.find(user=> user.id===payload.userId);
  if (!user) return res.send({accessToken :''});
  //user exist check if refresh toekn exist in the user
  if (user.refreshToken !== token){
    return res.send({accessToken : ""});
  }
  const refreshToken=createAccessToken(userId.id);
  user.refreshToken=refreshToken;
  sendRefreshToken(res, refreshToken);
  return res.send({accessToken});

})
server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});