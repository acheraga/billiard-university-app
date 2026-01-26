import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import ExamII from "../../src/components/ExamII.vue";
import { useExamsStore } from "../../src/store/useExamsStore";

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("ExamII Exam Sheet PDF", () => {
  it("renders Open/Download links and preview toggles iframe", async () => {
    const wrapper = mount(ExamII);
    const store = useExamsStore();

    // default level should be Bachelors
    expect(store.examII.currentLevel).toBe("Bachelors");

    const openLink = wrapper.find('.exam-sheet-actions a[target="_blank"]');
    expect(openLink.exists()).toBe(true);
    expect(openLink.attributes("href")).toBe("/BU_Exam-II_Skills-Bachelors_BW.pdf");

    const downloadLink = wrapper.find('.exam-sheet-actions a[download]');
    expect(downloadLink.exists()).toBe(true);
    expect(downloadLink.attributes("download")).toBe("BU_Exam-II_Skills-Bachelors_BW.pdf");

    // preview button toggles iframe
    const previewBtn = wrapper.find('.exam-sheet-actions button.btn-success');
    expect(previewBtn.exists()).toBe(true);

    await previewBtn.trigger("click");
    await nextTick();

    const iframe = wrapper.find('.pdf-preview iframe');
    expect(iframe.exists()).toBe(true);
    expect(iframe.attributes("src")).toBe("/BU_Exam-II_Skills-Bachelors_BW.pdf");

    // hide preview
    await previewBtn.trigger("click");
    await nextTick();
    expect(wrapper.find('.pdf-preview iframe').exists()).toBe(false);
  });
});