
//All routing is done here.
//console.log() is used for more clear understanding of the code.

var http=require('http');
var config=require('../config.js');

module.exports=function (app,express) {

	var api=express.Router();

	api.post('/sendOTP', function(req, res) {
		console.log("in routes 9");
		
		//Sending OTP to the clients mobile number entered using req.body.mobileNumber

		var send_data;
		var options = {
		  "method": "GET",
		  "hostname": "2factor.in",
		  "port": null,
		  "path": '/API/V1/'+config.AUTH_KEY+'/SMS/'+req.body.mobileNumber+'/AUTOGEN',
		  "headers": {}
		};

		var req_in = http.request(options, function (res_in) {
			var chunks = [];
			res_in.on("data", function (chunk) {
				chunks.push(chunk);
		  	});

			res_in.on("end", function () {
				var body = Buffer.concat(chunks);
				console.log(JSON.parse(body.toString()));		
				res.json(JSON.parse(body.toString()));  
				//this res is of /sendotp post.. here we send back the data and end the call
			});		  
		});

		req_in.write("{}");
		req_in.end();
	});

	api.post('/verifyOTP',function(req,res){

		console.log('routes verify 51');

		//Verification of OTP is done via the information send by the client 
		//through this call we check whether the encoded otp and the otp given by client matches or not.
		var options = {
			"method": "GET",
			"hostname": "2factor.in",
			"port": null,
			"path": '/API/V1/'+config.AUTH_KEY+'/SMS/VERIFY/'+req.body.encodedOtp+'/'+req.body.cOtp,
			"headers": {}
		};

		var req_in = http.request(options, function (res_in) {
			var chunks = [];

			res_in.on("data", function (chunk) {
				chunks.push(chunk);
			});

			res_in.on("end", function () {
				var body = Buffer.concat(chunks);
				console.log(JSON.parse(body.toString()));
				res.json(JSON.parse(body.toString()));
			});
		});

		req_in.write("{}");
		req_in.end();
	});

	return api;
}