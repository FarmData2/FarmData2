<template>
  <h3>BedPicker Example</h3>
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

  <h5>Component Props:</h5>
  <table class="example-table">
    <thead>
      <th>Prop</th>
      <th>Control</th>
    </thead>
    <tbody>
      <tr>
        <td>required</td>
        <td>
          <BFormCheckbox
            id="required-checkbox"
            data-cy="required-checkbox"
            switch
            v-model="required"
          />
        </td>
      </tr>
      <tr>
        <td>showValidityStyling</td>
        <td>
          <BFormCheckbox
            id="styling-checkbox"
            data-cy="styling-checkbox"
            switch
            v-model="validity.showStyling"
          />
        </td>
      </tr>
      <tr>
        <td>location</td>
        <td>
          <BFormRadioGroup
            buttons
            button-variant="outline-primary"
            size="sm"
            v-model="location"
          >
            <BFormRadio
              id="alf-button"
              data-cy="alf-button"
              value="ALF"
              v-on:click="location = 'ALF'"
            >
              ALF
            </BFormRadio>
            <BFormRadio
              id="b-button"
              data-cy="b-button"
              value="B"
              v-on:click="location = 'B'"
            >
              B
            </BFormRadio>
            <BFormRadio
              id="chuau-button"
              data-cy="chuau-button"
              value="CHUAU"
              v-on:click="location = 'CHUAU'"
            >
              CHUAU
            </BFormRadio>
            <BFormRadio
              id="ghana-button"
              data-cy="ghana-button"
              value="GHANA"
              v-on:click="location = 'GHANA'"
            >
              GHANA
            </BFormRadio>
            <BFormRadio
              id="jasmine-button"
              data-cy="jasmine-button"
              value="JASMINE"
              v-on:click="location = 'JASMINE'"
            >
              JASMINE
            </BFormRadio>
          </BFormRadioGroup>
        </td>
      </tr>
      <tr>
        <td>picked</td>
        <td>
          <BButton
            id="picked-button"
            data-cy="picked-button"
            variant="outline-primary"
            size="sm"
            v-bind:disabled="!['ALF', 'CHUAU', 'GHANA'].includes(location)"
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
        </td>
      </tr>
    </tbody>
  </table>

  <h5>Component Event Payloads:</h5>
  <table class="example-table">
    <thead>
      <th>Event</th>
      <th>Payload</th>
    </thead>
    <tbody>
      <tr>
        <td>picked</td>
        <td>{{ form.beds }}</td>
      </tr>
      <tr>
        <td>valid</td>
        <td>{{ validity.beds }}</td>
      </tr>
    </tbody>
  </table>

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

<style>
@import url('@css/fd2-examples.css');
@import url('@css/fd2-mobile.css');

/**
 * This ensures that the css for this file is picked up by the builder.
 * Not sure why this is necessary, but without it the css imports
 * above are not processed.
 */
bed-picker-hack {
  display: none;
}
</style>
