<template>
  <p>
    The BedPicker component allows the user to select beds from a within a
    location.
  </p>

  <hr />
  <BedPicker
    id="location-bed-picker"
    data-cy="location-bed-picker"
    v-bind:location="location"
    v-model:picked="form.beds"
    v-bind:required="required"
    v-bind:showValidityStyling="validity.showStyling"
    v-on:valid="
      (valid) => {
        validity.beds = valid;
      }
    "
    v-on:ready="createdCount++"
  />
  <hr />

  <strong>Component Props:</strong>
  <ul>
    <li>
      <BFormCheckbox
        id="required-checkbox"
        data-cy="required-checkbox"
        switch
        v-model="required"
      >
        required
      </BFormCheckbox>
    </li>
    <li>
      <BFormCheckbox
        id="styling-checkbox"
        data-cy="styling-checkbox"
        switch
        v-model="validity.showStyling"
      >
        showValidityStyling
      </BFormCheckbox>
    </li>
    <li>
      <BButtonGroup>
        <BButton
          id="alf-button"
          data-cy="alf-button"
          variant="outline-primary"
          size="sm"
          v-on:click="location = 'ALF'"
        >
          ALF
        </BButton>
        <BButton
          id="chuau-button"
          data-cy="chuau-button"
          variant="outline-primary"
          size="sm"
          v-on:click="location = 'CHUAU'"
        >
          CHUAU
        </BButton>
        <BButton
          id="ghana-button"
          data-cy="ghana-button"
          variant="outline-primary"
          size="sm"
          v-on:click="location = 'GHANA'"
        >
          GHANA
        </BButton>
      </BButtonGroup>
      location
    </li>
    <li>
      <BButton
        id="picked-button"
        data-cy="picked-button"
        variant="outline-primary"
        size="sm"
        v-on:click="
          bed = location + '-1';
          index = form.beds.indexOf(bed);
          if (index > -1) {
            form.beds.splice(index, 1);
          } else {
            form.beds.push(bed);
          }
        "
      >
        Toggle first bed
      </BButton>
      picked
    </li>
  </ul>

  <strong>Component State:</strong>
  <ul>
    <li>beds: {{ form.beds }}</li>
    <li>valid: {{ validity.beds }}</li>
  </ul>

  <div
    data-cy="page-loaded"
    v-show="false"
  >
    {{ pageDoneLoading }}
  </div>
</template>

<script>
import BedPicker from '@comps/BedPicker/BedPicker.vue';

export default {
  components: {
    BedPicker,
  },
  data() {
    return {
      required: true,
      location: 'ALF',
      form: {
        beds: [],
      },
      validity: {
        showStyling: false,
        beds: true,
      },
      createdCount: 0,
    };
  },
  computed: {
    pageDoneLoading() {
      return this.createdCount == 2;
    },
  },
  methods: {
    toggle(bed) {
      const index = this.form.beds.indexOf(bed);
      if (index > -1) {
        this.form.beds.splice(index, 1);
      } else {
        this.form.beds.push(bed);
      }
    },
  },
  created() {
    this.createdCount++;
  },
};
</script>
