import { useState, useEffect } from "react";

export function useFetch(url) {
	const [data, setData] = useState([]);

	useEffect(() => {
		fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("token"),
			},
		})
			.then((response) => response.json())
			.then((data) => setData(data));
	}, [url]);

	return data;
}
