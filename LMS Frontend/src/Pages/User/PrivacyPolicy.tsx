import "../../Common/styles/privacy.css";
import "../../Common/styles/courses.css";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicy() {
    const { t } = useTranslation();

    return (
        <div className="p-outer">
            <div className="courses-header" style={{ textAlign: "center", marginBottom: "1rem" }}>
                <div className="bg"></div>
                <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", zIndex: 10 }}>{t("Privacy Policy")}</h1>
            </div>
            <div className="p-inner">
                <p>We are committed to maintaining the accuracy, confidentiality, and security of your personally identifiable information ("Personal Information"). This privacy policy governs our practices regarding the collection, use, and disclosure of Personal Information and is based on the principles set forth in the Electronic Transactions Act of Sri Lanka.</p>

                <br />
                <h2>1. Introduction</h2>
                <p>We are responsible for the Personal Information under our control and have designated individuals to ensure compliance with this privacy policy.</p>
                <br />
                <h2>2. Identifying Purposes</h2>
                <p>We collect, use, and disclose Personal Information to provide requested products or services and to offer related products or services we believe may interest you. The purpose of collection will be identified before or at the time of collection. In some cases, purposes are evident and consent is implied — for example, when you provide your name, address, and payment information during a purchase.</p>
                <br />
                <h2>3. Consent</h2>
                <p>Your knowledge and consent are required for the collection, use, or disclosure of Personal Information, except where permitted or required by law. You always have the choice to provide or withhold your information. However, refusal may limit the services we can provide.</p>
                <br />
                <h2>4. Limiting Collection</h2>
                <p>We will collect only the Personal Information necessary for identified purposes. With your consent, information may be collected through in-person interactions, phone, mail, fax, or online communication.</p>
                <br />
                <h2>5. Limiting Use, Disclosure, and Retention</h2>
                <p>We will use or disclose Personal Information only for the purposes for which it was collected, unless otherwise authorized by you or required by law. Information will be retained only as long as necessary to fulfill those purposes or comply with legal requirements.</p>
                <br />
                <h2>6. Accuracy</h2>
                <p>We strive to keep Personal Information accurate, complete, and up-to-date as required for the purposes for which it is used.</p>
                <br />
                <h2>7. Safeguarding Customer Information</h2>
                <p>We protect Personal Information with appropriate security measures based on its sensitivity. We take reasonable precautions to prevent loss, misuse, or unauthorized access. In response to user feedback, we may block accounts when appropriate.</p>
                <p><strong>Note:</strong> Once phone numbers are shared between service providers and consumers, we cannot control subsequent interactions. We disclaim responsibility for any issues arising thereafter. However, we may review complaints and take precautionary action such as blacklisting offending parties.</p>
                <br />
                <h2>8. Openness</h2>
                <p>We will make information about our privacy practices available to you upon request.</p>
                <br />
                <h2>9. Customer Access</h2>
                <p>Upon request, you will be informed of the existence, use, and disclosure of your Personal Information and given access to it. You may request corrections if appropriate. In some cases, we may not be able to disclose certain information due to legal or proprietary constraints.</p>
                <br />
                <h2>10. Handling Complaints and Suggestions</h2>
                <p>For any questions or concerns regarding this policy or our privacy practices, please contact us at:</p>
                <p><strong>Email:</strong> info@koreanliveclass.com</p>
                <p><strong>Special Note:</strong> Once we share contact details between service providers and consumers, we consider our responsibility fulfilled. We do not mediate further disputes. However, we may review serious complaints and reserve the right to blacklist accounts if necessary.</p>
                <br />
                <h2>Additional Information</h2>
                <br />
                <h3>Cookies</h3>
                <p>We may use cookies to enhance website functionality and provide a personalized user experience. Most browsers accept cookies by default, but you may adjust your settings to decline them. Note that disabling cookies may affect website performance.</p>
                <br />
                <h3>Third-Party Websites</h3>
                <p>Our website may link to third-party sites that are not governed by this policy. We recommend reviewing their privacy policies to understand how they handle your information.</p>
            </div>
        </div>
    );
}
