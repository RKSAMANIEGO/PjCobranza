import { useEffect } from "react";
import { useState } from "react";

export function usePostCustomerFetch(url, body) {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
					body: JSON.stringify(body),
				});

				const responseData = await response.json();
				setData(responseData);
			} catch (error) {
				setError(error);
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	});

	return { data, loading, error };
}
