$(document).ready(function () {
  console.log('ready');

  searchLocation(localStorage.getItem('location'));

  $('#locationForm').submit((e) => {
    e.preventDefault();
    searchLocation();
  });

  $('#results').on('click', '.goingBtn', function (e) {
    $('#status').html('');
    $('#searchBtn').html('<i class="fa fa-circle-o-notch fa-spin"></i> Loading');
    const dataObject = {
      id: e.target.id,
      location: localStorage.getItem('location'),
      _csrf: $('input[name=_csrf]').val()
    };
    $.ajax({
      url: '/bars',
      type: 'PUT',
      contentType: "application/json",
      data: JSON.stringify(dataObject),
      success: function (response) {
        const result = parseInt(response);
        const goingCountEl = $(`#${dataObject.id}-count`);
        const existingCount = parseInt(goingCountEl.html());
        goingCountEl.html(result + existingCount);
        if (result > 0)
          $(`#${dataObject.id}`).html('Not going');
        else
          $(`#${dataObject.id}`).html('Going');
        $('#searchBtn').html('<i class="fa fa-search"></i> Search');
      },
      error: function (err) {
        $('#status').html('<div class="alert alert-danger">Sorry, request could not complete at this time.</div>');
      }
    });
    e.preventDefault();
  });



});

function searchLocation(storedLocation) {
  $('#status').html('');
  $('#searchBtn').html('<i class="fa fa-circle-o-notch fa-spin"></i> Loading');

  const location = storedLocation || $('#location').val();
  $('#location').val(location);

  const _csrf = $('input[name=_csrf]').val();
  localStorage.setItem('location', location);
  if (location === '') {
    $('#status').html('<div class="alert alert-danger">Please enter your city.</div>')
  }
  $.post('/', { location, _csrf })
    .done(function (response) {
      let responseText = '';
      const bars = response.bars;
      const userId = response.userId;
      bars.forEach((bar) => {
        responseText += '<div class="col-xs-6 col-sm-4 col-md-3">';
        responseText += `<div class="thumbnail"><img src="${bar.image_url}"/>`;
        responseText += `<div class="caption">`;
        responseText += `<h4>${bar.name}</h4><p>Rating: ${bar.rating}</p>`;
        responseText += `<p><span id="${bar.id}-count">${bar.goingUserId.length}</span> going</p>`
        if (userId) {
          const goingBtnText = (bar.goingUserId.indexOf(userId) === -1)? 'Going' : 'Not going';
          responseText += `<a class="btn btn-primary btn-xs goingBtn" id=${bar.id} href="#" role="button">${goingBtnText}</a>`;
        }
        responseText += '</div></div></div>';
      });
      $('#searchBtn').html('<i class="fa fa-search"></i> Search');
      $('#results').html(responseText);
    })
    .fail(function (error) {
      $('#searchBtn').html('<i class="fa fa-search"></i> Search');
      $('#status').html('<div class="alert alert-danger">Not available.</div>');
      $('#results').html('');
    });
}