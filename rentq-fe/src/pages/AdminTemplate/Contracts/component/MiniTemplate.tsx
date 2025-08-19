import moment from "moment";
import SignatureSection from "./SignatureSection";

interface MiniTemplateProps {
  place?: string;
  landlord?: any;
  rightsLandlord?: string;
  tenant?: any;
  property?: any;
  startDate?: string | Date;
  endDate?: string | Date;
  deposit?: number | string;
  rent?: number | string;
  numberToVietnameseWords?: (num: number) => string;
}

const MiniTemplate = ({
  place,
  landlord = {},
  tenant = {},
  property = {},
  startDate,
  endDate,
  deposit,
  rent,
  numberToVietnameseWords = () => "",
}: MiniTemplateProps) => {
  const linesRightLandlord =
    landlord.rightsLandlord
      ?.split("\n")
      .map((l: any) => l.trim())
      .filter(Boolean) || [];

  const linesDutiesLandlord =
    landlord.dutiesLandlord
      ?.split("\n")
      .map((l: any) => l.trim())
      .filter(Boolean) || [];

  const linesRightTenant =
    tenant.rightsTenant
      ?.split("\n")
      .map((l: any) => l.trim())
      .filter(Boolean) || [];

  const linesDutiesTenant =
    tenant.dutiesTenant
      ?.split("\n")
      .map((l: any) => l.trim())
      .filter(Boolean) || [];

  return (
    <div className=" " id="contract">
      <p className="center">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
      <p className="center italic">Độc lập - Tự do - Hạnh phúc</p>
      <p className="center">———————</p>
      <p className="text-right">
        {place || "....."}, ngày {new Date().getDate()} tháng{" "}
        {new Date().getMonth() + 1} năm {new Date().getFullYear()}
      </p>
      <h2 className="center pt-5 pb-7 text-xl">HỢP ĐỒNG THUÊ NHÀ</h2>
      <p>- Căn cứ Bộ luật Dân sự số 91/2015/QH13 ngày 24/11/2015;</p>
      <p>- Căn cứ Luật Thương mại số 36/2005/QH11 ngày 14 tháng 06 năm 2005;</p>
      <p>
        - Căn cứ vào nhu cầu và sự thỏa thuận của các bên tham gia Hợp đồng;
      </p>
      <p>
        Hôm nay, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1}{" "}
        năm {new Date().getFullYear()}, các Bên gồm:
      </p>
      <p>
        <strong>BÊN CHO THUÊ (Bên A):</strong>
      </p>
      <p className="indent">
        Ông (Bà):{" "}
        {landlord.name ||
          "............................................................"}
      </p>
      <p className="indent">
        CMND số: {landlord.cardNumber || "...................."}, Cơ quan cấp:{" "}
        {landlord.placeIssue || "...................."}, Ngày cấp:{" "}
        {moment(landlord.dateIssue).isValid()
          ? moment(landlord.dateIssue).format("DD/MM/YYYY")
          : "...................."}
      </p>
      <p className="indent">
        Nơi đăng ký thường trú:
        {landlord.address ||
          "......................................................................."}
      </p>
      <p>
        <strong>BÊN THUÊ (Bên B):</strong>
      </p>
      <p className="indent">
        Ông (Bà):{" "}
        {tenant.name ||
          "............................................................"}
      </p>
      <p className="indent">
        CMND số: {tenant.cardNumber || "...................."}, Cơ quan cấp:{" "}
        {tenant.placeIssue || "...................."}, Ngày cấp:{" "}
        {moment(tenant.dateIssue).isValid()
          ? moment(tenant.dateIssue).format("DD/MM/YYYY")
          : "...................."}
      </p>
      <p className="indent">
        Nơi đăng ký thường trú:
        {tenant.address ||
          "......................................................................."}
      </p>
      <p>Bên A và Bên B sau đây gọi chung là “Hai Bên” hoặc “Các Bên”.</p>
      <p>
        Sau khi thảo luận, Hai Bên thống nhất đi đến ký kết Hợp đồng thuê nhà
        (“Hợp Đồng”) với các điều khoản và điều kiện dưới đây:
      </p>
      <p className="section-title">
        Điều 1. Nhà ở và các tài sản cho thuê kèm theo nhà ở:
      </p>
      <p className="indent">
        1.1. Bên A đồng ý cho Bên B thuê và Bên B đồng ý thuê quyền sử dụng đất
        và một bất động sản liền với quyền sử dụng đất tại địa chỉ{" "}
        {property.address || "......."} để sử dụng làm nơi để ở.
      </p>
      <p className="sub-indent">
        Diện tích quyền sử dụng đất: {property.area || "..................."} m
        <sup>2</sup>;
      </p>
      <p className="sub-indent">
        Diện tích căn nhà: {property.area || "..................."} m
        <sup>2</sup>;
      </p>
      <p className="indent">
        1.2. Bên A cam kết quyền sử dụng đất và căn nhà gắn liền trên đất là tài
        sản sở hữu hợp pháp của Bên A. Mọi tranh chấp phát sinh từ tài sản cho
        thuê trên Bên A hoàn toàn chịu trách nhiệm trước pháp luật.
      </p>
      <p className="section-title">
        Điều 2. Bàn giao và sử dụng diện tích thuê:
      </p>
      <p className="indent">
        2.1. Thời điểm Bên A bàn giao tài sản thuê vào ngày{" "}
        {startDate
          ? moment(startDate).format("DD/MM/YYYY")
          : "...../...../....."}
        ;
      </p>
      <p className="indent">
        2.2. Bên B được toàn quyền sử dụng tài sản thuê kể từ thời điểm được Bên
        A bàn giao từ thời điểm quy định tại Mục 2.1 trên đây.
      </p>
      <p className="section-title">Điều 3. Thời hạn thuê:</p>
      <p className="indent">
        3.1. Bên A cam kết cho Bên B thuê tài sản với thời hạn là{" "}
        {endDate && startDate
          ? (() => {
              const duration = moment.duration(
                moment(endDate).diff(moment(startDate))
              );
              const years = duration.years();
              const months = duration.months();
              const days = duration.days();
              return `${years > 0 ? `${years} năm ` : ""}${
                months > 0 ? `${months} tháng ` : ""
              }${days > 0 ? `${days} ngày` : ""}`;
            })()
          : "....."}{" "}
        kể từ ngày bàn giao tài sản thuê;
      </p>
      <p className="indent">
        3.2. Hết thời hạn thuê nêu trên, nếu Bên B có nhu cầu tiếp tục sử dụng
        thì Bên A phải ưu tiên cho Bên B tiếp tục thuê.
      </p>
      <p className="section-title">Điều 4. Đặt cọc tiền thuê nhà:</p>
      <p className="indent">
        4.1. Bên B sẽ giao cho Bên A một khoản tiền là{" "}
        {deposit ? ` ${deposit}` : "......................"} VNĐ (bằng chữ:{" "}
        {deposit
          ? numberToVietnameseWords(Number(deposit))
          : "............................................"}
        ) ngay sau khi ký hợp đồng này. Số tiền này là tiền đặt cọc để đảm bảo
        thực hiện Hợp đồng cho thuê nhà.
      </p>
      <p className="indent">
        4.2. Nếu Bên B đơn phương chấm dứt hợp đồng mà không báo trước cho Bên A
        thì Bên A sẽ không hoàn trả số tiền đặt cọc này.
      </p>
      <p className="indent">
        Nếu Bên A đơn phương chấm dứt hợp đồng mà không báo trước cho Bên B thì
        Bên A sẽ phải hoàn trả số tiền đặt cọc và bồi thường thêm khoản bằng
        tiền đặt cọc.
      </p>
      <p className="indent">
        4.3. Tiền đặt cọc của Bên B sẽ không được dùng để thanh toán tiền thuê.
        Nếu Bên B vi phạm hợp đồng gây thiệt hại cho Bên A thì Bên A có quyền
        khấu trừ tiền đặt cọc để bù đắp chi phí khắc phục thiệt hại. Mức chi phí
        sẽ được các Bên thống nhất bằng văn bản.
      </p>
      <p className="indent">
        4.4. Vào thời điểm kết thúc hợp đồng hoặc chấm dứt hợp đồng, Bên A sẽ
        hoàn lại tiền đặt cọc sau khi đã khấu trừ chi phí khắc phục thiệt hại
        (nếu có).
      </p>
      <p className="section-title">Điều 5. Tiền thuê nhà:</p>
      <p className="indent">
        5.1. Tiền thuê nhà đối với diện tích thuê tại mục 1.1 điều 1 là:
        {" " + rent || "......................"} VNĐ/tháng (bằng chữ:
        {rent
          ? numberToVietnameseWords(Number(rent))
          : "..........................................."}
        )
      </p>
      <p className="indent">
        5.2. Tiền thuê nhà không bao gồm các chi phí khác như tiền điện, nước,
        vệ sinh... Khoản tiền này sẽ do bên B trả theo khối lượng, công suất sử
        dụng thực tế của Bên B hàng tháng, được tính theo đơn giá của nhà nước.
      </p>
      <p className="section-title">
        Điều 6. Phương thức thanh toán tiền thuê nhà:
      </p>
      <p className="indent">
        Tiền thuê nhà được thanh toán một tháng một lần vào ngày 05 hàng tháng.
      </p>
      <p className="indent">
        Các chi phí khác được bên B tự thanh toán với các cơ quan, đơn vị có
        liên quan khi được yêu cầu.
      </p>
      <p className="indent">
        Việc thanh toán tiền thuê nhà được thực hiện bằng đồng tiền Việt Nam
        theo hình thức trả trực tiếp bằng tiền mặt (nếu được yêu cầu).
      </p>
      <p className="section-title">
        Điều 7. Quyền và nghĩa vụ của Bên cho thuê:
      </p>
      <p className="indent">
        <strong>7.1. Quyền lợi:</strong>
      </p>
      <p className="sub-indent">
        - Yêu cầu Bên B thanh toán tiền thuê và các chi phí khác đầy đủ, đúng
        hạn;
      </p>
      <p className="sub-indent">
        - Yêu cầu Bên B sửa chữa thiệt hại do lỗi Bên B gây ra.
      </p>
      <div>
        {linesRightLandlord.length > 0 ? (
          linesRightLandlord.map((line: any, index: any) => (
            <p key={`line-${index}`} className="sub-indent">
              - {line}
            </p>
          ))
        ) : (
          <></>
        )}
      </div>
      <p className="indent">
        <strong>7.2. Nghĩa vụ:</strong>
      </p>
      <p className="sub-indent">
        - Bàn giao diện tích thuê cho Bên B theo đúng thời gian quy định trong
        Hợp đồng
      </p>
      <p className="sub-indent">
        - Đảm bảo việc cho thuê theo Hợp đồng này là đúng quy định của pháp
        luật;
      </p>
      <p className="sub-indent">
        - Đảm bảo cho Bên B thực hiện quyền sử dụng diện tích thuê một cách độc
        lập và liên tục trong suốt thời hạn thuê, trừ trường hợp vi phạm pháp
        luật và/hoặc các quy định của Hợp đồng này.
      </p>
      <p className="sub-indent">
        - Không xâm phạm trái phép đến tài sản của Bên B trong phần diện tích
        thuê. Nếu Bên A có những hành vi vi phạm gây thiệt hại cho Bên B trong
        thời gian thuê thì Bên A phải bồi thường.
      </p>
      <p className="sub-indent">
        - Tuân thủ các nghĩa vụ khác theo thoả thuận tại Hợp đồng này hoặc/và
        các văn bản kèm theo Hợp đồng này; hoặc/và theo quy định của pháp luật
        Việt Nam.
      </p>

      <div>
        {linesDutiesLandlord.length > 0 ? (
          linesDutiesLandlord.map((line: any, index: any) => (
            <p key={`line-${index}`} className="sub-indent">
              - {line}
            </p>
          ))
        ) : (
          <></>
        )}
      </div>

      <p className="section-title">Điều 8. Quyền và nghĩa vụ của Bên thuê:</p>
      <p className="indent">
        <strong>8.1. Quyền lợi:</strong>
      </p>
      <p className="sub-indent">
        - Nhận bàn giao diện tích thuê theo đúng thoả thuận trong Hợp đồng;
      </p>
      <p className="sub-indent">
        - Được sử dụng phần diện tích thuê làm nơi ở và các hoạt động hợp pháp
        khác;
      </p>
      <p className="sub-indent">
        - Yêu cầu Bên A sửa chữa kịp thời những hư hỏng không phải do lỗi của
        Bên B trong phần diện tích thuê để bảo đảm an toàn;
      </p>
      <p className="sub-indent">
        - Được tháo dỡ và đem ra khỏi phần diện tích thuê các tài sản, trang
        thiết bị của Bên B đã lắp đặt trong phần diện tích thuê khi hết thời hạn
        thuê hoặc đơn phương chấm dứt hợp đồng.
      </p>
      <div>
        {linesRightTenant.length > 0 ? (
          linesRightTenant.map((line: any, index: any) => (
            <p key={`line-${index}`} className="sub-indent">
              - {line}
            </p>
          ))
        ) : (
          <></>
        )}
      </div>
      <p className="indent">
        <strong>8.2. Nghĩa vụ:</strong>
      </p>
      <p className="sub-indent">
        - Sử dụng diện tích thuê đúng mục đích đã thỏa thuận, giữ gìn nhà ở và
        có trách nhiệm trong việc sửa chữa những hư hỏng do mình gây ra;
      </p>
      <p className="sub-indent">
        - Thanh toán tiền đặt cọc, tiền thuê đầy đủ, đúng thời hạn đã thỏa
        thuận;
      </p>
      <p className="sub-indent">
        - Trả lại diện tích thuê cho Bên A khi hết thời hạn thuê hoặc chấm dứt
        Hợp đồng thuê;
      </p>
      <p className="sub-indent">
        - Mọi việc sửa chữa, cải tạo, lắp đặt bổ sung các trang thiết bị làm ảnh
        hưởng đến kết cấu của căn phòng…, Bên B phải có văn bản thông báo cho
        Bên A và chỉ được tiến hành các công việc này sau khi có sự đồng ý bằng
        văn bản của Bên A;
      </p>
      <p className="sub-indent">
        - Tuân thủ một cách chặt chẽ quy định tại Hợp đồng này và các quy định
        của pháp luật Việt Nam.
      </p>
      <div>
        {linesDutiesTenant.length > 0 ? (
          linesDutiesTenant.map((line: any, index: any) => (
            <p key={`line-${index}`} className="sub-indent">
              - {line}
            </p>
          ))
        ) : (
          <></>
        )}
      </div>
      <p className="section-title">Điều 9. Đơn phương chấm dứt hợp đồng:</p>
      <p className="indent">
        Trong trường hợp một trong Hai Bên muốn đơn phương chấm dứt Hợp đồng
        trước hạn thì phải thông báo bằng văn bản cho bên kia trước 30 (ba mươi)
        ngày so với ngày mong muốn chấm dứt. Nếu một trong Hai Bên không thực
        hiện nghĩa vụ thông báo cho Bên kia thì sẽ phải bồi thường cho bên đó
        một khoản tiền thuê tương đương với thời gian không thông báo và các
        thiệt hại khác phát sinh do việc chấm dứt Hợp đồng trái quy định.
      </p>
      <p className="section-title">Điều 10. Điều khoản thi hành:</p>
      <p className="indent">
        - Hợp đồng này có hiệu lực kể từ ngày hai bên cùng ký kết;
      </p>
      <p className="indent">
        - Các Bên cam kết thực hiện nghiêm chỉnh và đầy đủ các thoả thuận trong
        Hợp đồng này trên tinh thần hợp tác, thiện chí;
      </p>
      <p className="indent">
        - Mọi sửa đổi, bổ sung đối với bất kỳ điều khoản nào của Hợp đồng phải
        được lập thành văn bản, có đầy đủ chữ ký của mỗi Bên. Văn bản sửa đổi bổ
        sung Hợp đồng có giá trị pháp lý như Hợp đồng, là một phần không tách
        rời của Hợp đồng này.;
      </p>
      <p className="indent">
        - Hợp đồng được lập thành 02 (hai) bản có giá trị như nhau, mỗi Bên giữ
        01 (một) bản để thực hiện.
      </p>

      <div className="flex justify-around  text-center">
        <div className="mt-12 text-center">
          <p>
            <strong>BÊN CHO THUÊ</strong>
          </p>
          <p>(Ký và ghi rõ họ tên)</p>
          <SignatureSection />
          {landlord.name && (
            <p className="mt-2">
              <strong>{landlord.name}</strong>
            </p>
          )}
        </div>
        <div className="mt-12 text-center">
          <p>
            <strong>BÊN THUÊ</strong>
          </p>
          <p>(Ký và ghi rõ họ tên)</p>
          <SignatureSection />
          {tenant.name && (
            <p className="mt-2">
              <strong>{tenant.name}</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniTemplate;
