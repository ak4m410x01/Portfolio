// Contact form handling
class FormHandler {
  constructor() {
    this.form = document.getElementById("contactForm");
    this.submitBtn = this.form?.querySelector(".btn-submit");
    this.formStatus = document.getElementById("formStatus");
    this.init();
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.initRealTimeValidation();
  }

  initRealTimeValidation() {
    const fields = this.form.querySelectorAll("input, textarea");

    fields.forEach((field) => {
      field.addEventListener("blur", () => this.validateField(field));
      field.addEventListener("input", () => this.clearFieldError(field));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute("name");
    const errorElement = document.getElementById(`${fieldName}Error`);

    this.clearFieldError(field);

    let isValid = true;
    let errorMessage = "";

    switch (fieldName) {
      case "name":
        if (value.length < 2) {
          isValid = false;
          errorMessage = "Name must be at least 2 characters long";
        }
        break;
      case "email":
        if (!Utils.validateEmail(value)) {
          isValid = false;
          errorMessage = "Please enter a valid email address";
        }
        break;
      case "subject":
        if (value.length < 5) {
          isValid = false;
          errorMessage = "Subject must be at least 5 characters long";
        }
        break;
      case "message":
        if (value.length < 10) {
          isValid = false;
          errorMessage = "Message must be at least 10 characters long";
        }
        break;
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  showFieldError(field, message) {
    field.classList.add("error");
    const errorElement = document.getElementById(
      `${field.getAttribute("name")}Error`
    );
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
    }
  }

  clearFieldError(field) {
    field.classList.remove("error");
    const errorElement = document.getElementById(
      `${field.getAttribute("name")}Error`
    );
    if (errorElement) {
      errorElement.textContent = "";
      errorElement.style.display = "none";
    }
  }

  validateForm() {
    const fields = this.form.querySelectorAll(
      "input[required], textarea[required]"
    );
    let isValid = true;

    fields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      Utils.showNotification(
        "Please fix the errors in the form before submitting.",
        "error"
      );
      return;
    }

    this.setLoadingState(true);

    try {
      // Simulate API call - replace with actual form submission
      await this.submitForm();

      this.showSuccess();
      this.form.reset();
    } catch (error) {
      this.showError(
        "Failed to send message. Please try again or contact me directly via email."
      );
    } finally {
      this.setLoadingState(false);
    }
  }

  async submitForm() {
    // Simulate API call delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random success/failure for demo
        const isSuccess = Math.random() > 0.2;
        if (isSuccess) {
          resolve();
        } else {
          reject(new Error("Simulated server error"));
        }
      }, 2000);
    });
  }

  setLoadingState(isLoading) {
    if (isLoading) {
      this.submitBtn.classList.add("loading");
      this.submitBtn.disabled = true;
    } else {
      this.submitBtn.classList.remove("loading");
      this.submitBtn.disabled = false;
    }
  }

  showSuccess() {
    Utils.showNotification(
      "Message sent successfully! I'll get back to you within 24 hours.",
      "success"
    );

    if (this.formStatus) {
      this.formStatus.textContent = "Message sent successfully!";
      this.formStatus.className = "form-status success";
      this.formStatus.style.display = "block";

      // Hide status after 5 seconds
      setTimeout(() => {
        this.formStatus.style.display = "none";
      }, 5000);
    }
  }

  showError(message) {
    Utils.showNotification(message, "error");

    if (this.formStatus) {
      this.formStatus.textContent = message;
      this.formStatus.className = "form-status error";
      this.formStatus.style.display = "block";
    }
  }
}

// Initialize form handler when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new FormHandler();
});
