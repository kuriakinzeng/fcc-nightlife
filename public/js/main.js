$(document).ready(function () {
  console.log('ready');

  searchLocation(localStorage.getItem('location'));

  $('#locationForm').submit((e) => {
    e.preventDefault();
    searchLocation();
  });

  $('#results').on('click', '.goingBtn', function (e) {
    $('#searchError').html('');
    const dataObject = {
      id: e.target.id,
      location: localStorage.getItem('location'),
      _csrf: $('input[name=_csrf]').val()
    };
    console.log('goingBtn', e.target, e.target.id);
    $.ajax({
      url: '/bars',
      type: 'PUT',
      contentType: "application/json",
      data: JSON.stringify(dataObject),
      success: function (response) {
        const result = parseInt(response);
        const goingCountEl = $(`#${dataObject.id}-count`);
        const existingCount = parseInt(goingCountEl.html());
        goingCountEl.html(result+existingCount);
        if(result>0)
          $(`#${dataObject.id}`).html('Not going');
        else
          $(`#${dataObject.id}`).html('Going');
      },
      error: function (err) {
        $('#searchError').html('<div class="alert alert-danger">Sorry, request could not complete at this time.</div>');
      }
    });
    e.preventDefault();
  });



});

function searchLocation(storedLocation) {
  console.log('search location', storedLocation);

  $('#results').html('<div class="col-xs-6 col-sm-4 col-md-3">Loading...</div>');
  $('#searchError').html('');
  const location = storedLocation || $('#location').val();
  $('#location').val(location);

  const _csrf = $('input[name=_csrf]').val();
  localStorage.setItem('location', location);
  if (location === '') {
    $('#searchError').html('<div class="alert alert-danger">Please enter your city.</div>')
  }
  $.post('/', { location, _csrf })
    .done(function (response) {
      let responseText = '';
      let bars = response.bars;
      bars.forEach((bar) => {
        responseText += '<div class="col-xs-6 col-sm-4 col-md-3">';
        responseText += `<div class="thumbnail"><img src="${bar.image_url}"/>`;
        responseText += `<div class="caption">`;
        responseText += `<h4>${bar.name}</h4><p>Rating: ${bar.rating}</p>`;
        responseText += `<p><span id="${bar.id}-count">${bar.goingCount || 0}</span> going</p>`
        if (response.userId)
          responseText += `<a class="btn btn-primary btn-xs pull-right goingBtn" id=${bar.id} href="#">Going</a>`;
        responseText += '</div></div></div>';
      });
      $('#results').html(responseText);
    })
    .fail(function (error) {
      $('#searchError').html('<div class="alert alert-danger">Sorry, request could not complete at this time.</div>');
      $('#results').html('');
    });
}