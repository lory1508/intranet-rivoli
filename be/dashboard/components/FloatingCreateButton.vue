<template>
  <NDropdown trigger="hover" :options="options" @select="handleSelect">
    <NButton 
      size="large" 
      type="primary" 
      class="w-fit"
    >
      <NIcon size="28">
        <Add />
      </NIcon>
    </NButton>
  </NDropdown>
  
  <DepartmentModal ref="departmentModalRef" />
  <ServiceModal ref="serviceModalRef" />
  <OfficeModal ref="officeModalRef" />
  <UserModal ref="userModalRef" />
</template>

<script setup>
import { Add } from "@vicons/ionicons5";
import { NIcon, NButton, NDropdown } from "naive-ui";
import { ref, h } from "vue";
import labels from "~/utils/labels/it.json";
import DepartmentModal from "~/components/organizzazione/DepartmentModal.vue";
import ServiceModal from "~/components/organizzazione/ServiceModal.vue";
import OfficeModal from "~/components/organizzazione/OfficeModal.vue";
import UserModal from "~/components/dipendenti/UserModal.vue";

const options = ref([
  {
    label: labels.department.create.title,
    key: "createDepartment",
  },
  {
    label: labels.service.create.title,
    key: "createService",
  },
  {
    label: labels.office.create.title,
    key: "createOffice",
  },
  {
    label: labels.user.create.title,
    key: "createUser",
  }
])

const departmentModalRef = ref();
const serviceModalRef = ref();
const officeModalRef = ref();
const userModalRef = ref();

const handleSelect = (key) => {
  switch (key) {
    case "createDepartment":
      departmentModalRef.value.show = true;
      break;
    case "createService":
      serviceModalRef.value.show = true;
      break;
    case "createOffice":
      officeModalRef.value.show = true;
      break;
    case "createUser":
      userModalRef.value.show = true;
      break;
  }
}
</script>