import React from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'

const Privacy = () => {
    return (
        <>
            < Header />
            <div className='space-y-10'>
                <div
                    className="w-[90%] h-[500px] m-auto p-16 rounded-3xl bg-contain bg-center mt-10"
                    style={{
                        backgroundImage: "url('/image/driving.jpg')"
                    }}
                >
                    <div className="flex flex-col items-center justify-center h-full text-center text-white rounded-3xl p-10 space-y-5">
                        <h1 className="text-5xl font-semibold">CHÍNH SÁCH VÀ QUY ĐỊNH</h1>
                    </div>
                </div>
                <div className='w-[90%] bg-red-200 rounded-3xl m-auto p-5 space-y-5'>
                    <h1 className='text-center text-2xl font-medium'>Thông báo</h1>
                    <p>
                        Mioto xin thông báo về việc bổ sung Chính sách bảo mật liên quan đến các vấn đề mới trong việc bảo vệ dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP của Chính phủ Việt Nam.
                    </p>
                    <p>
                        Trong quá trình thiết lập mối quan hệ giữa Mioto và Người dùng, giữ các người dùng với nhau phụ thuộc vào từng loại hình dịch vụ mà chúng tôi cung cấp, Mioto có thể thu thập và xử lý dữ liệu cá nhân của Quý Khách hàng. Mioto cam kết đảm bảo an toàn và bảo vệ dữ liệu cá nhân của Quý người dùng theo quy định của pháp luật Việt Nam.
                    </p>
                    <p>
                        Theo đó, bắt đầu từ ngày ra thông báo này, chúng tôi cần xác nhận lại sự đồng ý của bạn để tiếp tục thu thập, xử lý và chia sẻ dữ liệu cá nhân của bạn. Tuy nhiên, chúng tôi muốn nhắc nhở rằng nếu thu hồi sự đồng ý của mình, Quý Người dùng sẽ không thể tiếp cận với những người dùng khác trên nền tảng để phục vụ nhu cầu sử dụng dịch vụ của mình.
                    </p>
                    <p>
                        Mioto hiểu rằng việc bảo vệ dữ liệu cá nhân là rất quan trọng, và chúng tôi cam kết tuân thủ Nghị định 13/2023/NĐ-CP và các quy định về bảo vệ dữ liệu liên quan khác. Bỏ qua thông tin này nếu bạn đồng ý để chia sẻ thông tin cá nhân của mình với các Người dùng khác trên nền tảng Mioto. Hoặc vào tài khoản của mình để thu hồi/xóa dữ liệu. Cảm ơn sự quan tâm của bạn về vấn đề này. Chúng tôi rất trân trọng và hy vọng sẽ có cơ hội tiếp tục hỗ trợ bạn trong tương lai.
                    </p>

                </div>
                <div className='w-[90%] m-auto'>
                    <div className="p-8 ">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Chính sách & Quy định</h2>

                        <h3 className="text-2xl font-semibold text-blue-600 mt-8 mb-4">1. Trách nhiệm của khách thuê xe và công ty cho thuê trong giao dịch cho thuê xe tự lái</h3>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Mục đích lâu dài của Car-rental là hướng đến việc xây dựng cộng đồng cho thuê xe ô tô văn minh và uy tín tại Việt Nam.
                            Vì thế, để đảm bảo các giao dịch thuê xe được diễn ra một cách thuận lợi và thành công tốt đẹp thì
                            việc quy định trách nhiệm của các bên trong tuân thủ các chính sách của Car-rental và các điều khoản cam kết là rất quan trọng.
                        </p>

                        <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">A. Trách nhiệm của công ty</h4>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                            <li>Giao xe và toàn bộ giấy tờ liên quan đến xe đúng thời gian và trong tình trạng an toàn, vệ sinh sạch sẽ nhằm đảm bảo chất lượng dịch vụ.</li>
                            <li>Các giấy tờ xe liên quan bao gồm: giấy đăng ký xe (bản photo công chứng), giấy kiểm định, giấy bảo hiểm xe (bản photo công chứng hoặc bản gốc).</li>
                            <li>Chịu trách nhiệm pháp lý về nguồn gốc và quyền sở hữu của xe.</li>
                        </ul>
                        <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">B. Trách nhiệm khách thuê xe</h4>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                            <li>Kiểm tra kỹ xe trước khi nhận và trước khi hoàn trả xe. Kí xác nhận biên bản bàn giao về tình trạng xe khi nhận và khi hoàn trả.</li>
                            <li>Thanh toán đầy đủ tiền thuê xe cho công ty khi nhận xe.</li>
                            <li>Tại thời điểm nhận xe khách hàng xuất trình đầy đủ các giấy tờ liên quan cho công ty: GPLX ( đối chiếu bản gốc với thông tin GPLX đã xác thực trên app Car-rental & gửi lại), CCCD gắn chip (đối chiếu bản gốc với thông tin cá nhân trên VNeID & gửi lại) Hoặc Hộ chiếu (passport) bản gốc giữ lại. Đặt cọc tài sản thế chấp tiền mặt (15 triệu hoặc theo thỏa thuận với chủ xe) hoặc xe máy có giá trị tương đương 15 triệu trở lên (xe máy và cavet gốc) trước khi nhận xe.</li>
                            <li>Tuân thủ quy định và thời gian trả xe như đã thỏa thuận.</li>
                            <li>Chịu trách nhiệm đền bù mọi thất thoát về phụ tùng, phụ kiện của xe, đền bù 100% theo giá phụ tùng chính hãng nếu phát hiện phụ tùng bị tráo đổi, chịu 100% chi phí sửa chữa xe nếu có xảy ra hỏng hóc tùy theo mức độ hư tổn của xe, chi phí các ngày xe nghỉ không chạy được do lỗi của khách thuê xe (giá được tính bằng giá thuê trong hợp đồng) và các khoản phí vệ sinh xe nếu có.</li>
                        </ul>

                        <h4 class="text-xl font-semibold text-gray-800 mt-6 mb-3">C. Khuyến nghị của Car-rental</h4>
                        <ul class="list-disc list-inside text-gray-700 space-y-2 mb-6">
                            <li>Car-rental khuyến nghị Công ty và Khách thuê xe cần thực hiện việc giao kết bằng văn bản "Hợp đồng cho thuê xe tự lái" cũng như kí kết "Biên bản bàn giao xe" nhằm đảm bảo quyền lợi của cả 2 bên trong trường hợp phát sinh tranh chấp.</li>
                            <li>Chủ xe có thể tham khảo sử dụng mẫu "Hợp đồng thuê xe tự lái" và "Biên bản bàn giao xe" của Car-rental (vui lòng cung cấp email cho bộ phận CSKH của Mioto để nhận thông tin).</li>
                            <li>Công ty và khách thuê xe tự chịu toàn bộ trách nhiệm dân sự và hình sự nếu có phát sinh tranh chấp giữa hai bên nếu có theo chính sách hoạt động của công ty và điều khoản hợp đồng.</li>
                        </ul>

                        <h3 class="text-2xl font-semibold text-blue-600 mt-8 mb-4">2. Chính sách hủy chuyến</h3>
                        <h4 class="text-xl font-semibold text-gray-800 mt-6 mb-3">Dành cho khách thuê xe</h4>
                        <p class="text-gray-700 leading-relaxed mb-6">
                            Bạn là khách thuê xe, sau khi đã đặt cọc và đặt xe thành công, bạn có thể hủy chuyến đi đã đặt bằng cách gửi “Yêu cầu hủy chuyến” thông qua trang web car-rental.com, và lựa chọn lý do hủy chuyến.
                            Nếu thật sự muốn hủy chuyến, bạn nên lưu ý thực hiện việc này càng sớm càng tốt vì công ty sẽ tiến hành hoàn trả số tiền đặt cọc cho bạn tùy thuộc vào thời điểm bạn gửi yêu cầu hủy chuyến. Số tiền đặt cọc sẽ hoàn trả cho bạn được tính như sau
                        </p>
                        <table class="w-full border border-black rounded-lg overflow-hidden">
                            <thead>
                                <tr class="">
                                    <th class="px-4 py-2 text-left">Thời điểm Huỷ Chuyến</th>
                                    <th class="px-4 py-2 text-left">Phí huỷ chuyến</th>
                                    <th class="px-4 py-2 text-left">Số tiền cọc trả</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="border-b border-gray-200">
                                    <td class="px-4 py-2">Trong vòng một giờ sau khi đặt cọc</td>
                                    <td class="px-4 py-2">0% Tiền cọc</td>
                                    <td class="px-4 py-2">100% Tiền cọc</td>
                                </tr>
                                <tr class="bg-gray-50 border-b border-gray-200">
                                    <td class="px-4 py-2">Hơn 7 ngày trước khởi hành</td>
                                    <td class="px-4 py-2">30% Tiền cọc</td>
                                    <td class="px-4 py-2">70% Tiền cọc</td>
                                </tr>
                                <tr class="border-b border-gray-200">
                                    <td class="px-4 py-2">7 ngày hoặc ít hơn trước chuyến đi</td>
                                    <td class="px-4 py-2">100% Tiền cọc</td>
                                    <td class="px-4 py-2">0% Tiền cọc</td>
                                </tr>
                            </tbody>
                        </table>
                        <p class="mt-6 text-gray-700 leading-relaxed">
                            Trường hợp phát sinh Phí hủy chuyến, Công ty sẽ trừ vào tiền đặt cọc của Quý khách hàng.
                            Trường hợp Công ty hủy chuyến, Công ty sẽ hoàn trả lại 100% tiền cọc và phí hủy chuyến được đền bù cho Quý khách trong 1 - 3 ngày làm việc.
                        </p>
                        <h3 class="text-2xl font-semibold text-blue-600 mt-8 mb-4">4. Chính sách giá</h3>
                        <h4 class="text-xl font-semibold text-gray-800 mt-6 mb-3">Dành cho khách thuê xe</h4>
                        <p class="text-gray-700 leading-relaxed mb-6">
                            Trên ứng dụng Car-rental, mỗi dòng xe sẽ được cho thuê tại các mức giá khác nhau tùy thuộc vào sự quyết định của các công ty và được niêm yết công khai.
                        </p>
                        <p class="text-gray-700 leading-relaxed mb-6">
                            Về cơ bản, cơ cấu giá của một chuyến đi được tính bao gồm các thành phần:
                        </p>
                        <ul class="list-disc list-inside text-gray-700 space-y-2 mb-6">
                            <li>Đơn giá thuê: Là giá thuê niêm yết bởi chủ xe mà bạn dễ dàng nhìn thấy trong phần thông tin xe. Giá thuê trên Car-rental được tính theo đơn vị nhỏ nhất là ngày. Công ty có thể điều chỉnh giá thuê khác nhau cho từng ngày, chính vì vậy, chi phí thuê xe của bạn có thể tăng hoặc giảm tùy vào thời điểm bạn thuê xe. Thông thường, giá thuê sẽ cao hơn trong dịp cuối tuần và các ngày lễ, tết.</li>
                            <li>Mã khuyến mãi: là mã giảm giá mà Car-rental gửi tặng đến các thành viên của mình cho trong các đợt khuyến mãi, hoặc dành cho các thành viên thân thiết giao dịch thường xuyên trên ứng dụng. Mã khuyến mãi này sẽ được trừ trực tiếp vào chi phí thuê xe của bạn.</li>
                        </ul>

                        <h3 class="text-2xl font-semibold text-blue-600 mt-8 mb-4">5. Chính sách thanh toán</h3>
                        <p class="text-gray-700 leading-relaxed mb-6">
                            Sau khi nhận được sự đồng ý cho thuê xe từ phía công ty, tại bước cuối cùng, bạn cần phải đặt cọc trước cho Công ty 30% tổng chi phí chuyến đi. Bạn có thể chọn lựa hình thức thanh toán chuyển khoản qua ngân hàng trực tuyến hoặc sử dụng thẻ Visa.
                            Phần còn lại 70% bạn có thể thanh toán trực tiếp cho Công ty ngay khi nhận được xe.
                        </p>

                        <h3 class="text-2xl font-semibold text-blue-600 mt-8 mb-4">6. Chính sách thời gian giao nhận</h3>
                        <p class="text-gray-700 leading-relaxed mb-6">
                            Thời gian thuê xe mặc định trong hệ thống được thiết lập từ 9h tối đến 8h tối ngày kế tiếp. Tuy nhiên, khách hàng cũng có thể tùy chỉnh lựa chọn thời gian thuê xe theo nhu cầu của mình, trong vòng 24 giờ sẽ được tính 1 ngày.
                        </p>

                        <h3 class="text-2xl font-semibold text-blue-600 mt-8 mb-4">7. Chính sách kết thúc sớm chuyến đi</h3>
                        <p class="text-gray-700 leading-relaxed mb-6">
                            Khách thuê có thể kết thúc chuyến đi sớm và yêu cầu hoàn lại tiền cho các ngày chưa sử dụng tính theo đơn vị ngày. Lưu ý: bạn sẽ không nhận được số tiền đã cọc cho công ty.
                        </p>
                    </div>
                </div>

            </div>
            <Footer />
        </>
    )
}

export default Privacy