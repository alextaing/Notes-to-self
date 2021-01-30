function hourMinAmPm(dateobj) {
  let months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  let day = dateobj.getDate();
  let hours = dateobj.getHours();
  let minutes = dateobj.getMinutes();
  let ampm = "AM";

  if (hours < 0) {
    hours += 23;
    day -= 1;
  }

  if (hours > 23) {
    hours -=23;
    day += 1;
  }


  if (hours == 0) {
    hours = 12
  }

  if (hours > 11) {
    ampm = "PM";
    if (hours > 12) {
      hours = hours - 12;
    }
  }

  if (dateobj.getMinutes() < 10) {
    minutes = "0" + dateobj.getMinutes();
  }

  let readableDate = months[dateobj.getMonth()] + ' ' + dateobj.getDate() + ", " + dateobj.getFullYear() + " at " + hours + ':' + minutes + " " + ampm;

  return readableDate;
}


function submitButton() {
  var dateobj = new Date();
  var text = $('#blogpost').val().replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  var title = $('#posttitle').val().replace(/"/g, "&quot;").replace(/'/g, "&apos;");

  submission = {
    title: title,
    blogpost: text
  };

  let readableDate = hourMinAmPm(dateobj);

  $('.ajaxSend').prepend(
  '<div class="pastposts">' +
    '<div class="submittedPost group">' +
      '<div class="submittedTitle group">'+ submission.title +'</div>' +
      '<div class="submittedDate group">'+ readableDate +'</div>' +
      '<div class="group justsubmitted">'+ submission.blogpost +'</div>' +
    '</div>'
  )

  $.ajax({
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(submission),
    url: '/send',
    success: function() {
      $('#blogpost').val('');
      $('#posttitle').val('');
      $('.submitSuccessMessage').html('Submission Successful');
    }
  });
}


function open() {

  $.ajax({
    type: 'POST',
    dataType: 'json',
    url:'/openingPage',
    success: function(data) {
      data.postbody.forEach((row, i) => {
        let date = new Date(row.datetime);
        let readableDate = hourMinAmPm(date)
        $('.ajaxSend').prepend(
        '<div class="pastposts">' +
          '<div class="group">' +
            '<div class="submittedPost group" id="divPostId' +row.postId +'">' +

              '<div class="submittedTitle group" id="postId' + row.postId + '">'+ row.title +'</div>' +
              '<div class="submittedDate group">'+ readableDate +'</div>' +
              '<div class="justsubmitted group" id="content' + row.postId + '">'+ row.content +'</div>' +

              '<div id="openEditPost' + row.postId + '" class="postEditButton group"><button class="submitbutton" type="submit" value="submit" onclick="openEditPost('+ row.postId +')">Edit</button></div>' +

              '<div id="pastComments'+ row.postId +'" class="group"></div>'+

              '<div id="verifydelete' + row.postId + '"><button class="submitbutton" type="submit" value="submit" onclick="verifydelete('+ row.postId +')">Delete</button></div>' +


              '<div id="commentButton' + row.postId + '"><button class="submitbutton" type="submit" value="submit" onclick="comment('+ row.postId +')">Comment</button></div>' +

              '<div class="commentArea group" id="commentArea' + row.postId + '"></div>'+

              '<div id="postComment'+row.postId+'"></div>' +

            '</div>' +
          '</div>' +
        '</div>'
        )

        $('.table').prepend(
            '<a id="tocPostId' + row.postId + '" class="tablefont group" href="#postId' + row.postId + '">#'+ (i+1)+ ' '+ row.title + '</a>'
          )
      });

      data.commentbody.forEach((row, i) => {
        let date = new Date(row.datetime);
        let readableDate = hourMinAmPm(date)
        let target = "#pastComments" + row.mainPostId;
        $(target).append(
          '<div class="comments group" id=commentId'+ row.commentId+ '>' +
            '<div class="submittedDate group" id="commentDateId'+ row.commentId +'">'+ readableDate +'</div>' +
            '<div class="justsubmitted group" id="commentBodyId'+ row.commentId +'">'+ row.content +'</div>' +

            '<div id="verifydeleteComment' + row.commentId + '"><button class="submitbutton" type="submit" value="submit" onclick="verifydeleteComment('+ row.commentId +')">Delete</button></div>' +

            '<div id="openEditComment' + row.commentId + '"><button class="submitbutton" type="submit" value="submit" onclick="openEditComment('+ row.commentId +')">Edit</button></div>' +
          '</div>'
        );
      });

    }
  });
}


function openEditPost(id) {

  let title = $('#postId' + id).text().replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  let content = $('#content' + id).text().replace(/"/g, "&quot;").replace(/'/g, "&apos;");

  $('#postId' + id).html('<input class="posttitle" id="posttitle'+ id+'" type="text" name="title" value="'+ title +'">');

  $('#content' + id).html('<textarea class="blogpost group" id="blogpost'+ id+'" name="blogpost">'+ content +'</textarea>');

  $('#openEditPost' + id).html('<button class="submitbutton" type="submit" value="submit" onclick="cancelEditPost('+ id + ', \`' + title.replace(/`/g, "thiscoversforbackticks") + '\`, \`' + content.replace(/`/g, "thiscoversforbackticks") +'\`)">Cancel Edit</button><button class="submitbutton" type="submit" value="submit" onclick="submitEditPost('+id+')">Post Edit</button>');

}


function cancelEditPost(id, title, content) {
  $('#postId' + id).text(title.replace(/thiscoversforbackticks/g, "`"));

  $('#openEditPost' + id).html('<button class="submitbutton" type="submit" value="submit" onclick="openEditPost('+ id +')">Edit</button>');

  $('#content' + id).text(content.replace(/thiscoversforbackticks/g, "`"));
}


function submitEditPost(id){
  let newContent = $('#blogpost' + id).val().replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  let newTitle = $('#posttitle' + id).val().replace(/"/g, "&quot;").replace(/'/g, "&apos;");

  submission = {
    identification: id,
    title: newTitle,
    content: newContent
  }

  $.ajax({
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(submission),
    url: '/submitEditPost',
    success: function(data) {
      $('#postId' + id).html(newTitle);
      $('#content' + id).html(newContent);

      $('#openEditPost' + id).html('<button class="submitbutton" type="submit" value="submit" onclick="openEditPost('+ id +')">Edit</button>');
    }

  })
}


function openEditComment(id) {
  let comment = $('#commentBodyId' + id).text().replace(/"/g, "&quot;").replace(/'/g, "&apos;");

  $('#commentBodyId' + id).html('<textarea class="blogpost group" id="blogpost'+ id+'" name="blogpost">'+ comment +'</textarea>');

  $('#openEditComment' + id).html('<button class="submitbutton" type="submit" value="submit" onclick="cancelEditComment('+ id + ', \`' + comment.replace(/`/g, "thiscoversforbackticks") +'\`)">Cancel Edit</button><button class="submitbutton" type="submit" value="submit" onclick="submitEditComment('+id+')">Post Edit</button>');
}


function submitEditComment(id) {
  let newContent = $('#blogpost' + id).val().replace(/"/g, "&quot;").replace(/'/g, "&apos;");

  submission = {
    identification: id,
    content: newContent
  }

  $.ajax({
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(submission),
    url: '/submitEditComment',
    success: function(data) {
      $('#commentBodyId' + id).html(newContent);

      $('#openEditComment' + id).html('<button class="submitbutton" type="submit" value="submit" onclick="openEditComment('+ id +')">Edit</button>');
    }

  })
}


function cancelEditComment(id, comment) {

  $('#openEditComment' + id).html('<button class="submitbutton" type="submit" value="submit" onclick="openEditComment('+ id +')">Edit</button>');

  $('#commentBodyId' + id).text(comment.replace(/thiscoversforbackticks/g, "`"));
}


function comment(id) {
  $('#commentArea'+ id).html('<textarea class="commentBox group" id="commentBox' + id + '" ></textarea>')

  $('#postComment' + id).html('<button class="submitbutton" type="submit" value="submit" onclick="submitComment('+id+')">Post Comment!</button>');

  $('#commentButton' + id).html('<button class="submitbutton" type="submit" value="submit" onclick="retractComment('+ id +')">Cancel</button>');
}


function retractComment(id) {
  $('#postComment' + id).html('');
  $('#commentArea' + id).html('');

  $('#commentButton' + id).html('<button class="submitbutton" type="submit" value="submit" onclick="comment('+ id +')">Comment</button>');
}


function submitComment(id) {
  var text = $('#commentBox'+ id).val().replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  console.log(id);

  submission = {
    comment: text,
    mainPostId: id
  }

  let dateobj = new Date();
  let readableDate = hourMinAmPm(dateobj);

  $.ajax({
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(submission),
    url: '/comment'
  });

  $('#postComment' + id).html('');
  $('#commentArea' + id).html('');


  $('#pastComments' + id).append(
    '<div class="comments group">' +
      '<div class="submittedDate group">'+ readableDate +'</div>' +
      '<div class="justsubmitted group">'+ submission.comment +'</div>' +
    '</div>'
  )
  retractComment(id);
}


function verifydeleteComment(id) {
  $('#verifydeleteComment'+id).html('<button class="submitbutton" type="submit" value="submit" onclick="deletecommentbutton('+ id +')">Sure?</button>')
}


function deletecommentbutton(id) {
  data = {
    identification: id
  };

  $.ajax({
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(data),
    url: '/deleteComment',
    success: function() {
      $('#commentId'+ id).html("Comment Deleted!")
    }
  });
};


function verifydelete(id) {
  $('#verifydelete'+id).html('<button class="submitbutton" type="submit" value="submit" onclick="deletebutton('+ id +')">Sure?</button>')
}


function deletebutton (id){

  data = {
    identification: id
  };

  $.ajax({
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(data),
    url: '/delete',
    success: function() {
      $('#divPostId'+id).html("Post Deleted!")
      $('#tocPostId'+id).html("Post Deleted!")

    }
  });
};


open();
