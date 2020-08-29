describe("test onload event",function(){
    it('onload',function(){
        cy.visit('https://static-dsu.wesure.cn/sitapp/app0/h5-questionnaire/', {
            onLoad: function(contentWindow)  {
              // contentWindow is the remote page's window object
                console.log("###############################")
                console.log(contentWindow)
                console.log("###############################")
            }
    })
})
})