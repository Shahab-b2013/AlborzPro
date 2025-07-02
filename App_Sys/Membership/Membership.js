// Code File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.3.0.0

function loignUser() {

    var username = $.trim($('#username').val());

    var password = $.trim($('#password').val());

    if (username == '' || password == '') {

        $('#login-msg').html($$Local.Login_NotFilledMessage);

        $('#login-msg').addClass('bg-red');

        return;
    }

    password = securePassword(password);

    $.ajax({

        type: 'POST',

        url: 'App_Sys/Services/Membership.asmx/LoginSession',

        data: '{"username":"' + username + '","password":"' + password + '","usercode":"' + secureCode() + '"}',

        contentType: 'application/json; charset=utf-8',

        dataType: 'json',

        error: function (jqXHR, textStatus, errorThrown) {

            $('#login-msg').html(JSON.stringify(jqXHR));
        },

        success: function (data) {

            var result = data.d;

            if (result.code == '1') {

                var userCode = secureCode();

                localStorage.clear();

                iLoadCommonData();

                localStorage.setItem("H0Mr598ykwxfBu26DYCgJgcM", userCode);

                jQuery.redirect('MainDesk.aspx', {
                    'id': result.defaultPage,
                    'objKey': '0',
                    'requestToken': genResponseToken()
                }, 'POST', '');
            }

            if (result.code == '0') {

                $('#login-msg').html(result.message);

                $('#login-msg').addClass('bg-red');
            }
           
            if (result.code == '2') {

                jQuery.redirect('App_Sec/ChangePassword.aspx', {
                    'requestToken': genResponseToken()
                }, 'POST', '');
                return;
            }

            if (result.code == '3' || result.code == '4') {

                jQuery.redirect('App_Sec/Verification.aspx', {
                    'requestToken': genResponseToken()
                }, 'POST', '');
            }

            if (result.code == '31' || result.code == '41') {

                $('#login-msg').html(result.message);

                $('#login-msg').addClass('bg-red');
            }

            if (result.errorCode) {

                $('#login-msg').addClass('bg-red');

                $('#login-msg').html($$Local.Session_IsExpiredMessage);

                return;
            }
        }
    });
}

function loignUser2() {

    var usercode = $.trim($('#usercode').val());

    if (usercode == '' || usercode == '0') {

        $('#login-msg').html($$Local.Login_NotFilledMessage);

        $('#login-msg').addClass('bg-red');

        return;
    }

    $.ajax({

        type: 'POST',

        url: '../App_Sys/Services/Membership.asmx/LoginSession2',

        data: '{"usercode":"' + usercode + '","password":"' + securePassword2() + '"}',

        contentType: 'application/json; charset=utf-8',

        dataType: 'json',

        error: function (jqXHR, textStatus, errorThrown) {

            $('#login-msg').html(JSON.stringify(jqXHR));
        },

        success: function (data) {

            var result = data.d;

            if (result.code == '1') {

                localStorage.clear();

                localStorage.setItem("H0Mr598ykwxfBu26DYCgJgcM", usercode);

                iLoadCommonData();

                jQuery.redirect('../MainDesk.aspx', {
                    'id': result.defaultPage,
                    'objKey': '0',
                    'requestToken': genResponseToken()
                }, 'POST', '');
            }

            if (result.code == '0') {

                $('#login-msg').html(result.message);

                $('#login-msg').addClass('bg-red');
            }

            if (result.errorCode) {

                $('#login-msg').addClass('bg-red');

                $('#login-msg').html($$Local.Session_IsExpiredMessage);

                return;
            }
        }
    });
}

function securePassword(password) {

    password = hashp(password);

    if (typeof (Storage) !== 'undefined') {

        sessionStorage.setItem('N2VhMDE0MmQtYmU2My00Mjk5LWI3ZGYtO', password);

    } else {

        alert('Sorry! No Web Storage support..');
    }

    return hashk(password, sessionStorage.getItem('CjUPwOteYmZ3lphJiOiJ'));
}

function securePassword2() {

    return hashk(sessionStorage.getItem('N2VhMDE0MmQtYmU2My00Mjk5LWI3ZGYtO'), sessionStorage.getItem('CjUPwOteYmZ3lphJiOiJ'));
}

function genResponseToken() {
  
    return hashk(sessionStorage.getItem('N2VhMDE0MmQtYmU2My00Mjk5LWI3ZGYtO'), sessionStorage.getItem('CjUPwOteYmZ3lphJiOiJ'));
}

function checkToken() {

    if (sessionStorage.getItem('N2VhMDE0MmQtYmU2My00Mjk5LWI3ZGYtO') == null) {

        jQuery.redirect('../Error.aspx', { 'Id': 'ftbkaR9msC'}, 'GET', '');

        return false;
    }

    return true;
}

function setRequestToken(requestToken) {

    return sessionStorage.setItem('CjUPwOteYmZ3lphJiOiJ', requestToken);
}

function hashp(password) {

    password = md5(password) + sha1(password) + md5(password);

    password = sha1(password) + md5(password) + sha1(password);

    return sha1(password);
}

function hashk(salt, key) {

    key = md5(salt) + sha1(salt + key) + md5(salt);

    key = sha1(key) + md5(salt + key) + sha1(key);

    return sha1(key);
}

function keepAliveSession() {
   
    $.ajax({

        type: 'POST',

        url: '../App_Sys/Services/Membership.asmx/KeepAliveSession',

        data: '{}',

        contentType: 'application/json; charset=utf-8',

        dataType: 'json',

        error: function (jqXHR, textStatus, errorThrown) {
         
            if (window.location.port == 80 || window.location.port == 443)
                jQuery.redirect('../Default.aspx', {}, 'POST', '');
            else
                jQuery.redirect(window.location.protocol + '//' + window.location.hostname + '/MainDesk.aspx', {}, 'POST', '');
        },

        success: function (data) {
          
            if (jQuery.parseJSON(data.d)) {
             
                setTimeout('keepAliveSession();', 1 * 60 * 1000);
            } else {
                if (window.location.port == 80 || window.location.port == 443)
                    jQuery.redirect('../Default.aspx', {}, 'POST', '');
                else
                    jQuery.redirect(window.location.protocol + '//' + window.location.hostname + '/MainDesk.aspx', {}, 'POST', '');
            }
        }
    });
}

function logoutUser() {

    $.ajax({

        type: 'POST',

        url: 'App_Sys/Services/Membership.asmx/LogoutSession',

        data: '{}',

        contentType: 'application/json; charset=utf-8',

        dataType: 'json',

        error: function (jqXHR, textStatus, errorThrown) {

            jQuery.redirect('Default.aspx', {}, 'POST', '');
        },

        success: function (data) {

            jQuery.redirect('Default.aspx', {}, 'POST', '');
        }
    });
}

function closeUser() {

    $.ajax({

        type: 'POST',

        url: 'App_Sys/Services/Membership.asmx/LogoutSession',

        data: '{}',

        contentType: 'application/json; charset=utf-8',

        dataType: 'json',

        async: false
    });
}

function setSaltKey(saltKey) {

    saltKey = hashp(saltKey);

    if (typeof (Storage) !== 'undefined') {

        sessionStorage.setItem('N2VhMDE0MmQtYmU2My00Mjk5LWI3ZGYtO', saltKey);

    } else {

        alert('Sorry! No Web Storage support..');
    }
}

function secureCode() {

    return localStorage.getItem('H0Mr598ykwxfBu26DYCgJgcM');
}

function changePassword() {

    var p2 = document.getElementById("password");

    var p3 = document.getElementById("rpassword");

    if (p2.value == "" || p3.value == "")
    {
        alert("رمز عبور و تکرار آن پر نشده است")
        return;
    }

    if (p2.value != p3.value) {
        alert("رمز عبور و تکرار آن برابر نیستند")
        return;
    }

    var txtpass = p2.value;
    var score = 1;

    //check pass policy
    if (txtpass.length > 9) score--;

    var score_num = 2;
    var score_letter = 2;
    var score_special = 2;

    for (var i = 0; i < txtpass.length; i++) {

        if ((txtpass.charAt(i).match(/[a-z]/)) || (txtpass.charAt(i).match(/[A-Z]/)) || txtpass.charAt(i).match(/[ۀةيژؤإأءابپتثجچحیخدذرزسشطظعغفقکگلمنوهیئضص]/)) {
            score_letter--;
        }

        if (txtpass.charAt(i).match(/[0-9]/)) {
            score_num--;
        }

        if (txtpass.charAt(i).match(/[!,@,#,$,%,^,&,*,?,_,~,\-,(,),>,<,.,؟,|,?,/,\\,+,=,:,",»,«,{,},\[,\],;,']/)) {
            score_special--;
        }
    }

    if (score > 0 || score_letter > 0 || score_num > 0 || score_special > 0) {

        alert("رمز عبور ضعیف است.سیاست تعیین رمز عبور به درستی رعایت نشده است");
        return;
    }

    password = passwordInput(txtpass);

    $.ajax({

        type: 'POST',

        url: '../App_Sys/Services/Membership.asmx/ChangePassword',

        data: '{"password":"' + password + '"}',

        contentType: 'application/json; charset=utf-8',

        dataType: 'json',

        error: function (jqXHR, textStatus, errorThrown) {

            $('#login-msg').html(JSON.stringify(jqXHR));
        },

        success: function (data) {

            var result = data.d;

            if (result.code == '1') {

                alert("رمز جدید با موفقیت تغییر یافت");

                var userCode = secureCode();

                localStorage.clear();

                iLoadCommonData();

                localStorage.setItem("H0Mr598ykwxfBu26DYCgJgcM", userCode);

                jQuery.redirect('../MainDesk.aspx', {
                    'id': result.defaultPage,
                    'objKey': '0',
                    'requestToken': genResponseToken()
                }, 'POST', '');
            }

            if (result.code == '2') {

                $('#login-msg').html(result.message);

                $('#login-msg').addClass('bg-red');
            }
        }
    });
}