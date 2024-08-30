<script setup lang="ts">
import axios from "../AxiosFile";
import { onMounted, ref } from "vue";
import { VDataTable } from "vuetify/labs/VDataTable";

const companyList = ref([]);
const search = ref("");

const headers = [
  { title: "Company Name", key: "company_name" },
  { title: "Company Description", key: "company_description" },
  { title: "Company Website", key: "company_website" },
  { title: "Departments", key: "departmentCount" },
  { title: "Employees", key: "employeeCount" },
  { title: "Projects", key: "projectCount" },
  { title: "Address", key: "address" },
  { title: "ACTIONS", key: "actions" },
];

const getCompanyList = async () => {
  try {
    const response = await axios.get("companies/all-companies");
    companyList.value = response.data.map((company) => ({
      ...company,
      departmentCount: (company.departments || []).length,
      employeeCount: (company.employees || []).length,
      projectCount: (company.projects || []).length,
    }));
    console.log("Fetched company list:", companyList.value);
  } catch (e) {
    console.error("Error fetching company list", e);
  }
};

const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [""],
  sortDesc: [false],
});

onMounted(() => {
  getCompanyList();
});
</script>

<template>
    <div>
      <VCardText>
        <VRow>
          <VCol cols="12" offset-md="8" md="4">
            <AppTextField
              v-model="search"
              placeholder="Search ..."
              append-inner-icon="tabler-search"
              single-line
              hide-details
              dense
              outlined
            />
          </VCol>
        </VRow>
      </VCardText>
  
      <VDataTable
        :headers="headers"
        :items="companyList"
        :items-per-page="options.itemsPerPage"
        :page="options.page"
        :options="options"
        :search="search"
      >
        <!-- Company Name -->
        <template #items.company_name="{ items }">
          <span>{{ items.company_name }}</span>
        </template>
  
        <!-- Company Description -->
        <template #items.company_description="{ items }">
          <span>{{ items.company_description }}</span>
        </template>
  
        <!-- Company Website -->
        <template #items.company_website="{ items }">
          <a :href="items.company_website" target="_blank">Website</a>
        </template>
  
        <!-- Address -->
        <template #items.address="{ items }">
          <span>{{ items.address }}</span>
        </template>
  
        <!-- Departments Count -->
        <template #items.departmentCount="{ items }">
          <VTooltip activator="parent" location="top">
            <template #activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on" class="d-inline-block">
                {{ items.departmentCount }}
              </span>
            </template>
            <ul>
              <li v-for="(department, index) in items.departments" :key="index">
                {{ department }}
              </li>
            </ul>
          </VTooltip>
        </template>
  
        <!-- Employees Count -->
        <template #items.employeeCount="{ items }">
          <VTooltip activator="parent" location="top">
            <template #activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on" class="d-inline-block">
                {{ items.employeeCount }}
              </span>
            </template>
            <ul>
              <li v-for="(employee, index) in items.employees" :key="index">
                {{ employee }}
              </li>
            </ul>
          </VTooltip>
        </template>
  
        <!-- Projects Count -->
        <template #items.projectCount="{ items }">
          <VTooltip activator="parent" location="top">
            <template #activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on" class="d-inline-block">
                {{ items.projectCount }}
              </span>
            </template>
            <ul>
              <li v-for="(project, index) in items.projects" :key="index">
                {{ project }}
              </li>
            </ul>
          </VTooltip>
        </template>
  
        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="d-flex gap-1">
            <IconBtn>
              <VIcon icon="tabler-edit" />
            </IconBtn>
            <IconBtn>
              <VIcon icon="tabler-trash" />
            </IconBtn>  
          </div>
        </template>
  
        <template #bottom>
          <VCardText class="pt-2">
            <div
              class="d-flex flex-wrap justify-center justify-sm-space-between gap-y-2 mt-2"
            >
              <VSelect
                v-model="options.itemsPerPage"
                :items="[5, 10, 25, 50, 100]"
                label="Rows per page:"
                variant="underlined"
                style="max-inline-size: 8rem; min-inline-size: 5rem"
              />
              <VPagination
                v-model="options.page"
                :total-visible="$vuetify.display.smAndDown ? 3 : 5"
                :length="Math.ceil(companyList.length / options.itemsPerPage)"
              />
            </div>
          </VCardText>
        </template>
      </VDataTable>
    </div>
  </template>
  
