import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import ExamII from "../../src/components/ExamII.vue";

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("ExamII skill figures", () => {
  it("renders a figure image for the first skill (S1)", async () => {
    const wrapper = mount(ExamII);
    const firstSkillCard = wrapper.find('.skill-card');
    expect(firstSkillCard.exists()).toBe(true);

    const img = firstSkillCard.find('img');
    expect(img.exists()).toBe(true);
    // src is processed by Vite, ensure filename included
    expect(img.attributes('src')).toContain('s1.svg');
    expect(img.attributes('alt')).toBe('Figure S1');
  });
});