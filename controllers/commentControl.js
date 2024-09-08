const Reciepe=require("../models/reciepe");
const Comment=require("../models/comment");
const PresentDate=require("../public/javascript/Date");


module.exports.submitComment=async(req,res)=>{

    const {id}=req.params;
    const {body,rating}=req.body;
    const reciepe= await Reciepe.findById(id);
    
    const {date,month,year}= PresentDate();
    
    const comment=new Comment({
        body:body,
        rating:5,
        date:date,
        year:year,
        month:month
    });
    const commentBy=req.user;
    comment.postedBy=commentBy.username;
    reciepe.comments.push(comment._id);
    await comment.save();
    await reciepe.save();
    
    req.flash('success',' New Comment Successfully Added');
    res.redirect(`/reciepe/${id}`);
};


module.exports.deleteComment=async(req, res) => {
    
    const { id, commentId } = req.params;
    
    await Reciepe.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);

    req.flash('error','  Comment Deleted successfully ');
    res.redirect(`/reciepe/${id}`);
};