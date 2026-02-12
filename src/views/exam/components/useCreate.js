import { useAgent } from "@/hooks/useAgent"
import { createTestOrder } from "@/api/testPaper";
import { useRoute } from "vue-router";

export const useCreate = () => {
	const route = useRoute()

	const { md, ua, isWeChat, network, os } = useAgent();
	async function create({ answerList, version }) {
		const { testPaperId, promotionId, hasParams, source,shareCode } = route.query;
		const { width, height } = window.screen;
		const params = {
			phoneModel: "",
			browserVersion: ua,
			screenResolution: `${width}*${height}`,
			network,
			useEnv: isWeChat ? 1 : 2,
			hasParams,
			source,
		};
		if (os == "iOS") {
			params.phoneModel = md.os() + md.version("iPhone");
		} else if (os == "AndroidOS") {
			params.phoneModel = md.os() + md.version("Android");
		}
		const repone = await createTestOrder({
			...params,
			testPaperId,
			promotionId,
			version,
			// answerList: answerList.map(item => item.answer),
			answerList: answerList,
			shareCode:shareCode,
		});
		return repone
	}
	return [create]
}