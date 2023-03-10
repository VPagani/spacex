import Script from "next/script";

export default function GoogleSetup() {
	return (
		<>
			<Script src="https://www.googleoptimize.com/optimize.js?id=OPT-KTW99F9" />
			<Script src="https://www.googletagmanager.com/gtag/js?id=G-JNW55GWE94" />
			<Script
				id="google-analytics"
				dangerouslySetInnerHTML={{
					__html: `
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'G-JNW55GWE94', {
							page_path: window.location.pathname,
					 	});
					`,
				}}
			/>
		</>
	);
}
