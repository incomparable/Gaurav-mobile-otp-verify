  var global_otp_encode;

    jQuery(document).ready(function() {
        var oApp = jQuery("#app-container");
        jQuery('#form-step1').submit(function(oEvent) {
            oEvent.preventDefault();
            var sMobileNumber = jQuery("#mobile_number").val();
            
            //------------Handle point number 2 in the Application Flow here --------
            //Performing $.ajax request to backend API to 
            //-----------------------------------------------------------------------
            
            if(sMobileNumber==='' || sMobileNumber===null ){
                alert('Input is empty');
            }
            else{
                
                var data={
                    mobileNumber:sMobileNumber
                };
                $.ajax({
                    method:"POST",
                    data:data,
                    url:'/api/sendOTP',
                    success:function(res){
                        console.log(res);
                        if(res.Status=="Success"){
                            oApp.removeClass("step1");
                            oApp.addClass("step2");
                            global_otp_encode=res.Details;
                            $("#step-2 #form-step2").prepend('<div class="show-message">OTP has sent to '+sMobileNumber.substring(0,1)+'*****'+sMobileNumber.substring(sMobileNumber.length-3)+' . Please verify.'+'</div>');
                        }
                        else{
                            alert(res.Details);
                        }
                    },
                    error:function(err){
                        console.log(err);
                    }
                });
            }
        });

        // Step 2 submit handling
        jQuery("#form-step2").submit(function(oEvent) {
            oEvent.preventDefault();
            var sMobileNumber = jQuery("#mobile_number").val();
            var sOtp = jQuery("#verification_code").val();
            
            //------------Handle point number 4,6 in the Application Flow here --------
            //Performing $.ajax request to backend API to verify OTP and display response
            //-----------------------------------------------------------------------

            var data={
                cOtp:sOtp,
                encodedOtp:global_otp_encode
            };
            $.ajax({
                method:"POST",
                data:data,
                url:'/api/verifyOTP',
                success:function(res){
                    console.log(res);
                    if(res.Status=="Success"){
                        alert(res.Details);
                        oEvent.preventDefault();
                        window.location.href='/';
                        // alert('OTP has send to' + sMobileNumber);
                    }
                    else{
                        alert(res.Details);
                    }
                },
               error:function(err){
                    console.log(err);
                }
            });
        });


        jQuery("#backBtn").click(function(oEvent) {
            oEvent.preventDefault();
            oApp.removeClass("step2");
            oApp.addClass("step1");
        });

    });