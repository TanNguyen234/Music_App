export const filterStatus = (query: any) => {//contaroller mới có req.query

    let filterStatus = [                  //Tạo bộ lộc trang thái để thêm class active cho nó để nó có tính navigate
        {
            name: "Tất cả",
            status: "",
            class: ""    
        },
        {
            name: "Hoạt động",
            status: "active",
            class: "" 
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: ""
        }
    ];

    if(query.status) {                   //Nếu url có key tên status
        const index = filterStatus.findIndex(item => item.status == query.status);//Tìm index trong object filterStatus phần tử mà có giá trị giống giá trị của status trên url
        filterStatus[index].class = "active";                                        //Cho phần tử có giá tri giống trên key url class là active
    } else {
        const index = filterStatus.findIndex(item => item.status == '');             //Ngược lại nếu không có key status trên url  thì tìm phần tử có status="" trong filterStatus 
        filterStatus[index].class = "active";                                        // Có nghĩ là item có status.name="Tất cả" có class="active"
    }
    
    return filterStatus;
}