

let ds = "";
let id = 0;
let entity = "";

// *******  Cookies

export function getCookie () {
    let cookies = {};
    var Wert = "";
    if (document.cookie) {
        let cookieString = document.cookie;
        while (cookieString.length) {
            let key = cookieString.substring(0, cookieString.indexOf("=")).trim();
            if (key.startsWith("srch_")) {

            }
            let Wertstart = cookieString.indexOf("=") + 1;
            let Wertende = cookieString.indexOf(";");
            if (Wertende == -1) {
              Wertende = cookieString.length;
            }
            cookies[key] = cookieString.substring(Wertstart, Wertende);
            cookieString = cookieString.substring(Wertende + 1)
        }
    }
    return cookies;
  }
  
  export function setCookie (Bezeichner, Wert) {
    const jetzt = new Date();
    let  Verfall = 30 * 24 * 60 * 60 * 1000;
    const Auszeit = new Date(jetzt.getTime() + Verfall);
    document.cookie = Bezeichner + "=" + Wert + "; expires=" + Auszeit.toGMTString() + ";";
  }
  
export function clean(field) {
    if (typeof field == 'undefined') {
        return "";
    }
    if (typeof field == 'boolean') {
        return '' + field;
    }
    if (typeof field == 'number') {
        return '' + field;
    }
    return field;
}

/*  GET  */
/*
export const getData = function (crit) {
    entity = crit.entity ? crit.entity : "dummy";
    ds = entity.substring(0, 1).toUpperCase() + entity.substring(1);
    let param = "";
    if (crit.id) {
        param = "?id=" + crit.id;
    } else {
        param = "?x";
        if (crit.params){
            Object.keys(crit.params).forEach(key => {
                param += "&" + key + "=" + crit.params[key];
            })
        }
    }
    return new Promise(
        function (resolve, reject) {
            const urly = baseUrl + "ng" + ds + ".json" + param;
            fetch(urly, {
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    // console.log(data)
                    resolve(data);
                })
                .catch(err => {
                    var reason = new Error('Fehler!');
                    reject(reason); // reject
                });
        }
    )
};
*/
/*  Post  */
/*
export const saveData = function (crit, data) {
    entity = crit.entity ? crit.entity : "dummy";
    ds = entity.substring(0, 1).toUpperCase() + entity.substring(1);
    //    id = crit.id ? crit.id : "0";
    return new Promise(
        function (resolve, reject) {
            const urly = baseUrl + "ng" + ds + ".json?pg";
            fetch(urly, {
                credentials: "include",
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json;charset=UTF-8"
                },
                config: {command: 'hallo'}
            })
                .then(res => res.json())
                .then(data => {
                    // console.log(data)
                    resolve(data.data);
                })
                .catch(err => {
                    var reason = new Error('Fehler!');
                    reject(reason); // reject
                });
        }
    )
};
*/


export const sendMail = function (data) {
    console.log(JSON.stringify(data));
    return new Promise(
        function (resolve, reject) {
            const urly = "http://services.car-ware.ch:81/sesmailer/send.mail";
            fetch(urly, {
                credentials: "include",
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json;charset=UTF-8"
                },
                config: {command: 'hallo'}
            })
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    // console.log(data)
                    resolve(data.data);
                })
                .catch(err => {
                    var reason = new Error('Fehler!');
                    reject(reason); // reject
                });
        }
    )
};




export const login = function (credentials) {
    return new Promise(
        function (resolve, reject) {
            fetch(baseUrl + "ngLogin", {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(credentials),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Failed!");
                    }
                    return res.json();
                })
                .then(data => {
                    resolve(data.user ? data.user : {});
                })
                .catch(err => {
                    console.log(err);
                });
        })
}





export function checkLogin() {
    return new Promise(
        function (resolve, reject) {
    fetch(baseUrl + "ngLogin", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(data => {
        resolve(data.user ? data.user : {});
      })
      .catch(err => {
        console.log(err);
    });
});
}



export const getNationen = function () {
  return new Promise(
      function (resolve, reject) {
          const urly = baseUrl + "ngNation.json";
          fetch(urly, {
//              credentials: "include"
          })
              .then(res => res.json())
              .then(data => {
                  // console.log(data)
                  resolve(data);
              })
              .catch(err => {
                  var reason = new Error('Fehler!');
                  reject(reason); // reject
              });
      }
  )
};
