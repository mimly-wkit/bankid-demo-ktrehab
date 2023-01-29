 $('[data-toggle="tooltip"]').tooltip();
        $(function() {

            // $.noConflict();
            $.post(BEHANDLARE_URL+'conference/gua', function(response) {
                if (response == 'error') {
                    $('.modal_cng_brow').modal("show");
                }
            });
            $('.alwbankidlogin').click(function(){
                var login = 0;
                console.log('bankid');
                
                if($(this).prop("checked")){
                    login = 1;
                }
                $.post(BEHANDLARE_URL+'group_meetings/update_allow_bankid/'+$(this).data('id'),
                {a:login},
                function(resp){});
                // alert(login);
            });
            
            $('.disablechat').on('click',function(){
                var chat = 0;
                console.log('bankid');
                
                if($(this).prop("checked")){
                    chat = 1;
                }
                $.post(BEHANDLARE_URL+'group_meetings/update_disable_chat/'+$(this).data('id'),
                {a:chat},
                function(resp){});
                // alert(login);
            });
            $('.resend-sms').on('click',function(){
                url = $(this).data('href');
                that = $(this);
                $.post(url,function(resp){
                    $(that).addClass('disabled');
                    if(resp)toastr.success('Notification Send Successfully', {timeOut: 3000})
                })
            });

            $('.resend-email').on('click',function(){
            url = $(this).data('href');that = $(this);
            $.post(url,function(resp){
                $(that).addClass('disabled');
                if(resp)toastr.success('Email Send Successfully', {timeOut: 3000})

            });

            

        });

            let reco_sess = sessionStorage.getItem("recommondation")
            if(typeof(reco_sess) !== 'undefined')
            {
                if(reco_sess != 'yes')
                {
                    setTimeout(function(){ 
                        if (window.innerWidth < 800) {
                            if(window.sessionStorage) { 
                                sessionStorage.setItem("recommondation", 'yes');
                                $('.recommandModel').modal('show');
                            }
                        }
                    }, 3000);
                }
            }
          
            
            $('#notesBtn').on('click',function()
            {
                var meeting_id = $('#meeting_id').html();
                $.post(BEHANDLARE_URL+'conference/get_notes/'+meeting_id, function(response) {
                    $('#notesbody').html(response)
                $('#notesModal').modal("show");
            });
            });
        });
        function Areyousure()
        {
            if(confirm('Are you sure you want to end this session ?'))
            {
                $('#feedbackModal').modal('show');
            }
            else
            {
                return false;
            }
        }