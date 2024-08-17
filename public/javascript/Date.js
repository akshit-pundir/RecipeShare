
function PresentDate(){

    const d=new Date();
    let today=d.getDate();
    let Year=d.getFullYear();
    const Allmonths = [
      'Jan', 'Feb', 'Mar', 'April', 'May', 'June',
      'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
      ];
       let monthIdx=d.getMonth();
       let Month=Allmonths[monthIdx];


return { date:today, month:Month , year:Year}
}

module.exports=PresentDate;