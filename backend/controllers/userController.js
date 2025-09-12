import createDB from '../config/connection.js';

// Get User datas
export const getUserData = async (req,res) => {
    try{
    const  userId  = req.userId;

   const db = await createDB.getConnection ? await createDB.getConnection() : await createDB();

        // Find user by email
        const [userRows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
        if (userRows.length === 0) {
            return res.json({ success: false, message: 'User not found' });
        }
        const user = userRows[0];

    if(!user){
        return res.json({success:false,message:'User Not Found'});
    }

  return res.json({
        success:true,
        userData:{
            name: user.name,
            role: user.role,
            isAccountVerified: user.isAccountVerified
        }
    })

    } catch(error){
      return res.json({success:false,message:error.message});
    }
}
