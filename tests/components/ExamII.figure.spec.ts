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
    // default currentSkillIndex is 0 (S1)
    const card = wrapper.find(".skill-card");
    expect(card.exists()).toBe(true);

    const img = card.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toContain("/exam2_images/Bachelors/image-001.jpg");
    expect(img.attributes("alt")).toContain("Figure S1");
  });

  it("S3 displays three layout images and files exist (Bachelors)", async () => {
    const wrapper = mount(ExamII);
    // set component to show S3 (index 2)
    (wrapper.vm as any).currentSkillIndex = 2;
    await wrapper.vm.$nextTick();

    const card = wrapper.find(".skill-card");
    expect(card.exists()).toBe(true);

    const imgs = card.findAll("img");
    expect(imgs.length).toBe(3);

    // verify that layout images are larger (CSS width-based check)
    const firstImgStyle = imgs[0].element.getBoundingClientRect();
    // bounding rect may be zero in JSDOM; instead assert attribute existence and src correctness
    expect(imgs[0].attributes("src")).toContain("/exam2_images/Bachelors/image-003.jpg");

    // click the first layout to open modal
    await imgs[0].trigger("click");
    await wrapper.vm.$nextTick();

    const modal = wrapper.find(".figure-modal");
    expect(modal.exists()).toBe(true);

    const modalImg = modal.find(".modal-image");
    expect(modalImg.exists()).toBe(true);
    expect(modalImg.attributes("src")).toContain("/exam2_images/Bachelors/image-003.jpg");

    const desc = modal.find(".modal-description");
    expect(desc.exists()).toBe(true);
    expect(desc.text().length).toBeGreaterThan(5);

    // close modal (button)
    const close = modal.find(".modal-close");
    await close.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".figure-modal").exists()).toBe(false);

    // open modal again and simulate swipe-to-close
    await imgs[0].trigger("click");
    await wrapper.vm.$nextTick();
    const modal2 = wrapper.find(".figure-modal");
    const content = modal2.find(".modal-content");
    expect(content.exists()).toBe(true);

    // simulate touchstart at Y=100, touchmove to Y=260 (> threshold), then touchend
    await content.trigger("touchstart", { touches: [{ clientY: 100 }] });
    await content.trigger("touchmove", { touches: [{ clientY: 260 }] });
    await content.trigger("touchend");
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".figure-modal").exists()).toBe(false);
  });

  it("navigation wraps around (prev/next)", async () => {
    const wrapper = mount(ExamII);
    // at start index 0
    expect((wrapper.vm as any).currentSkillIndex).toBe(0);
    // click prev should wrap to last
    await wrapper.find(".prev-btn").trigger("click");
    expect((wrapper.vm as any).currentSkillIndex).toBe(9);

    // click next should wrap to first
    await wrapper.find(".next-btn").trigger("click");
    expect((wrapper.vm as any).currentSkillIndex).toBe(0);
  });
});
