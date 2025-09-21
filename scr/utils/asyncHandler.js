//higher order function

const asyncHandler = (requestHanler) =>{
    return (req,res,next)=>{
        Promise.resolve(requestHanler(req,res,next)).catch
        ((err)=> next(err))
    }
} 

export default asyncHandler
// const asyncHandler = (fn) => async (req,res,next)=>{
//     try {
//         await fn(req,res,next)
        
//     } catch (error) {
//        res.status(error.code || 500).json({
//         success:false,
//         message:error.message
//        }) 
//     }
// }