export default function MkdSDK() {
  this._baseurl = "https://reacttask.mkdlabs.com";
  this._project_id = "reacttask";
  this._secret = "5fchxn5m8hbo6jcxiq3xddofodoacskye";
  this._table = "";
  this._custom = "";
  this._method = "";

  const raw = this._project_id + ":" + this._secret;
  let base64Encode = btoa(raw);

  this.setTable = function (table) {
    this._table = table;
  };
  
  this.login = async function (email, password, role) {
    console.log("email: " + email, "password: " + password, "role: " + role, "base64Encode: " + base64Encode);
    const response = await fetch("https://reacttask.mkdlabs.com/v2/api/lambda/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmcm9udC1lbmQtZGV2ZWxvcGVyLTJAaWJsLm14IiwiY29tcGFueV9pZCI6ImE2YmQyODg3LTBmNGEtNGU1Zi1iMGI1LTAwMGQ5ODE3YWIyMyIsInVzZXJfaWQiOiIwMmEwMDg2YS0yZGE4LTRhZjUtYWQzNy0zMTYxMzNjZDQwN2QiLCJ1c2VyX3R5cGVzIjpbIkNPTlRSQUNUT1JfSU5fQ0hBUkdFIl0sImlzcyI6Ii9jb3Jwb3JhdGUtdXNlci1wcmUtcHJvZC12MS90b2tlbiIsImV4cCI6MjAxODk1MDk5MX0.v0SAnRR4bm8crHCro1U9z89Gz4X1go6YSN6-od0ktjc",
        "x-project": "cmVhY3R0YXNrOjVmY2h4bjVtOGhibzZqY3hpcTN4ZGRvZm9kb2Fjc2t5ZQ=="
      },
      body: JSON.stringify({
        email:email,
        password:  password,
        role: "admin"
      }),
    });
    console.log("response",response);
    // const data = await response.json();
    return response;
    //TODO
  };

  this.getHeader = function () {
    return {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "x-project": base64Encode,
    };
  };

  this.baseUrl = function () {
    return this._baseurl;
  };
  
  this.callRestAPI = async function (payload, method) {
    const header = {
      "Content-Type": "application/json",
      "x-project": base64Encode,
      Authorization: "Bearer " + localStorage.getItem("token"),
    };

    switch (method) {
      case "GET":
        const getResult = await fetch(
          this._baseurl + `/v1/api/rest/${this._table}/GET`,
          {
            method: "post",
            headers: header,
            body: JSON.stringify(payload),
          }
        );
        const jsonGet = await getResult.json();

        if (getResult.status === 401) {
          throw new Error(jsonGet.message);
        }

        if (getResult.status === 403) {
          throw new Error(jsonGet.message);
        }
        return jsonGet;
      
      case "PAGINATE":
        if (!payload.page) {
          payload.page = 1;
        }
        if (!payload.limit) {
          payload.limit = 10;
        }
        const paginateResult = await fetch(
          this._baseurl + `/v1/api/rest/${this._table}/${method}`,
          {
            method: "post",
            headers: header,
            body: JSON.stringify(payload),
          }
        );
        const jsonPaginate = await paginateResult.json();

        if (paginateResult.status === 401) {
          throw new Error(jsonPaginate.message);
        }

        if (paginateResult.status === 403) {
          throw new Error(jsonPaginate.message);
        }
        return jsonPaginate;
      default:
        break;
    }
  };  

  this.check = async function (role) {
    //to do
    console.log("role: " + role);
  };

  return this;
}
