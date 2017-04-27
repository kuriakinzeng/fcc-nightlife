$(document).ready(function() {

  console.log('ready');

  $('.goingBtn').click((e)=>{
    e.preventDefault();
    console.log('btn-clicked',e.target.id);
  })

});